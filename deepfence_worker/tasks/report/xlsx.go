package report

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"time"

	url2 "net/url"

	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/minio/minio-go/v7"

	// "github.com/deepfence/ThreatMapper/deepfence_utils/directory"
	// "github.com/deepfence/ThreatMapper/deepfence_utils/log"
	"github.com/deepfence/ThreatMapper/deepfence_server/model"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"
)

func GenerateXLSXReport(msg *message.Message) error {
	var err error
	var reportPayload model.ReportStruct
	log.Info().Msg("Generating report")
	fmt.Println("generating report")
	tenantID := msg.Metadata.Get(directory.NamespaceKey)
	if len(tenantID) == 0 {
		log.Error().Msg("tenant-id/namespace is empty")
		return errors.New("tenant-id/namespace is empty")
	}
	log.Info().Msgf("message tenant id %s", string(tenantID))

	log.Info().Msgf("uuid: %s payload: %s ", msg.UUID, string(msg.Payload))

	err = json.Unmarshal(msg.Payload, &reportPayload)
	if err != nil {
		log.Error().Msg("error while processing report payload")
	}

	ctx := directory.NewContextWithNameSpace(directory.NamespaceID(tenantID))

	client, err := directory.Neo4jClient(ctx)
	if err != nil {
		log.Error().Msg("error 1")
		log.Error().Msgf("%s", err)
		return err
	}

	session := client.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	if err != nil {
		log.Error().Msg("some error 2")
		return err
	}
	defer session.Close()

	tx, err := session.BeginTransaction()
	if err != nil {
		log.Error().Msg("some error 3")
	}
	defer tx.Close()

	rq, err := tx.Run("MATCH (n:Secret)  return n", map[string]interface{}{})

	if err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	records, err := rq.Collect()

	if err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	f := excelize.NewFile()

	secretDocHeader := map[string]string{"A1": "FileName", "B1": "ImageLayerId", "C1": "level", "D1": "kubernetes_cluster_name", "E1": "node_name", "F1": "Score", "G1": "Matched Content", "H1": "Node Type", "I1": "TimeStamp", "J1": "Host Name", "K": "Node Id"}

	//f.SetSheetName("Sheet1", "Secret")

	for k, v := range secretDocHeader {
		f.SetCellValue("Sheet1", k, v)
	}
	// it should work
	for _, record := range records {
		if record.Values[0] == nil {
			log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
			continue
		}

		secretDoc := record.Values[0].(dbtype.Node)

		// log.Info().Msgf("%+v", secretDoc.Props)
		log.Info().Msgf("%s", secretDoc.Props["full_filename"])

	}

	if err = os.MkdirAll("/tmp/"+reportPayload.ReportID, os.ModePerm); err != nil {
		log.Error().Msg("while making the folder")
		return err
	}

	secretFilename := fmt.Sprintf("/tmp/%s/secret-scan.xlsx", reportPayload.ReportID)
	if err := f.SaveAs(secretFilename); err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	b, err := os.ReadFile(secretFilename)
	if err != nil {
		log.Error().Err(err).Msg("ReadFile")
		return err
	}

	mc, err := directory.MinioClient(ctx)
	if err != nil {
		log.Error().Msg(err.Error())
		return err
	}

	file := path.Join("/report/", reportPayload.ReportID, "/secret-scan.xlsx")
	res, err := mc.UploadFile(ctx, file, b,
		minio.PutObjectOptions{ContentType: "application/xlsx"})
	key := ""
	if err != nil {
		ape, ok := err.(directory.AlreadyPresentError)
		if ok {
			log.Warn().Err(err).Msg("Skip upload")
			key = ape.Path
		} else {
			log.Error().Err(err).Msg("Upload")
			return err
		}
	} else {
		key = res.Key
	}

	url, err := mc.ExposeFile(ctx, key, 10*time.Hour, url2.Values{})
	if err != nil {
		log.Error().Err(err)
		return err
	}

	reportPayload.FileURL = url
	reportPayload.FinishedAt = time.Now().Format("2006-01-02 15:04:05.000000000")
	reportPayload.Status = "completed"

	log.Info().Msgf("Exposed URL: %v", url)

	_, err = tx.Run("match (n:REPORT:XLSX {report_id: $uid}) set n.url = $url, n.finished_at = $finishedAt, n.status = $status return n", map[string]interface{}{"uid": reportPayload.ReportID, "url": reportPayload.FileURL, "finishedAt": reportPayload.FinishedAt, "status": reportPayload.Status})

	if err != nil {
		log.Error().Msg("something happened while saving it to db")
	}

	tx.Commit()

	return err
}

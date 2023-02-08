package report

import (
	"errors"
	"fmt"

	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/ThreeDotsLabs/watermill/message"

	// "github.com/deepfence/ThreatMapper/deepfence_utils/directory"
	// "github.com/deepfence/ThreatMapper/deepfence_utils/log"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"
)

func GenerateReport(msg *message.Message) error {
	var err error
	log.Info().Msg("Generating report")
	fmt.Println("generating report")
	tenantID := msg.Metadata.Get(directory.NamespaceKey)
	if len(tenantID) == 0 {
		log.Error().Msg("tenant-id/namespace is empty")
		return errors.New("tenant-id/namespace is empty")
	}
	log.Info().Msgf("message tenant id %s", string(tenantID))

	log.Info().Msgf("uuid: %s payload: %s ", msg.UUID, string(msg.Payload))

	ctx := directory.NewGlobalContext()

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
	if err := f.SaveAs("/secret-scan.xlsx"); err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	for _, record := range records {
		if record.Values[0] == nil {
			log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
			continue
		}

		secretDoc := record.Values[0].(dbtype.Node)

		log.Info().Msgf("%+v", secretDoc.Props)
		log.Info().Msgf("%s", secretDoc.Props["full_filename"])

	}

	return err
}

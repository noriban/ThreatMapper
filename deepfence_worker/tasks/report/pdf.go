package report

import (
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"time"

	"html/template"
	url2 "net/url"

	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/minio/minio-go/v7"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"

	// "github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"

	// "github.com/deepfence/ThreatMapper/deepfence_utils/directory"
	// "github.com/deepfence/ThreatMapper/deepfence_utils/log"

	pdf "github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/deepfence/ThreatMapper/deepfence_server/model"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/deepfence/golang_deepfence_sdk/utils/utils"
	// "github.com/deepfence/golang_deepfence_sdk/utils/utils"
)

// var t *template.Template

// func init() {
// 	t = template.Must(template.ParseGlob("secret/*.gohtml"))
// }

type Info struct {
	Title string
	Items []string
}

type Info2 struct {
	Title                     string
	StartTime                 string
	EndTime                   string
	AppliedFilters            []Filter
	OverallSeveritySummary    string
	SeverityCount             map[string]int64
	NodeWiseSeverityCountData []NodeWiseSeverityCountDoc
}

type NodeWiseSeverityCountDoc struct {
	NodeWiseSeverityCount map[string]map[string]int64
	NodeWiseSeverityData  []SecretDoc
}

type SecretDoc struct {
	Identity              int      `json:"identity"`
	Labels                []string `json:"labels"`
	FullFilename          string   `json:"full_filename"`
	ImageLayerID          string   `json:"ImageLayerId"`
	Level                 string   `json:"level"`
	KubernetesClusterName string   `json:"kubernetes_cluster_name"`
	Masked                string   `json:"masked"`
	StartingIndex         int      `json:"starting_index"`
	RelativeEndingIndex   int      `json:"relative_ending_index"`
	NodeName              string   `json:"node_name"`
	Score                 float64  `json:"score"`
	MatchedContent        string   `json:"matched_content"`
	NodeType              string   `json:"node_type"`
	ContainerName         string   `json:"container_name"`
	ScanID                string   `json:"scan_id"`
	RelativeStartingIndex int      `json:"relative_starting_index"`
	HostName              string   `json:"host_name"`
	NodeID                string   `json:"node_id"`
}

type SecretDocCount struct {
	High int `json:"high"`
	// Medium   int `json:"medium"`
	// Low      int `json:"low"`
	// Critical int `json:"critical"`
}

type Filter struct {
	Type_           string
	TypeInformation string
}

type SeverityWisecount struct {
	Low      int64 `json:"low"`
	Medium   int64 `json:"medium"`
	High     int64 `json:"high"`
	Critical int64 `json:"critical"`
}

//go:embed secret/*.gohtml
var content embed.FS

func SecretDocumentsLevel(ctx context.Context, tx neo4j.Transaction, _ []Filter) map[string]int64 {
	var scanIds []string

	log.Info().Msgf("scan ids %v", scanIds)
	scanIds = []string{"47e915c47511ef211d80b817c87dd81aa83d6bd6b31e315c3eeca6a86b49ec3a-1677171997"}

	// scanDocs := SecretDocCount{}
	secretDocsLevelCount := make(map[string]int64)
	secretDocsLevelCount["low"] = 0
	secretDocsLevelCount["medium"] = 0
	secretDocsLevelCount["high"] = 0
	secretDocsLevelCount["critical"] = 0
	for _, id := range scanIds {
		log.Info().Msgf("scan ids %v", id)
		rq, err := tx.Run("MATCH (n:Secret) where n.scan_id = $id return n.level as level, count(n) as count ", map[string]interface{}{
			"id": id,
		})
		if err != nil {
			log.Error().Msg("some error 3")
			return secretDocsLevelCount
		}
		records, err := rq.Collect()
		if err != nil {
			log.Error().Msg("some error 3")
			return secretDocsLevelCount
		}
		for _, record := range records {
			if record.Values[0] == nil {
				log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
				continue
			}
			value, ok := record.Values[1].(int64)
			if !ok {
				log.Error().Msgf("int;  got %T", value)
			}
			key, ok := record.Values[0].(string)
			if !ok {
				log.Error().Msgf("want type string];  got %T", key)
			}

			if secretDocsLevelCount[key] == 0 {
				secretDocsLevelCount[key] = value
			}

			log.Info().Msgf("%+v", secretDocsLevelCount)
		}
	}
	var total int64
	total  = 0
	for _,v := range secretDocsLevelCount {
		total = total + v
	}
	secretDocsLevelCount["total"] = total
	return secretDocsLevelCount
}

func SecretDocuments(ctx context.Context, tx neo4j.Transaction, _ []Filter) []SecretDoc {
	var scanIds []string

	log.Info().Msgf("scan ids %v", scanIds)
	scanIds = []string{"47e915c47511ef211d80b817c87dd81aa83d6bd6b31e315c3eeca6a86b49ec3a-1677171997"}

	scanDocs := []SecretDoc{}

	for _, id := range scanIds {
		log.Info().Msgf("scan ids %v", id)
		rq, err := tx.Run("MATCH (n:Secret) where n.scan_id = $id return n", map[string]interface{}{
			"id": id,
		})
		if err != nil {
			log.Error().Msg("some error 3")
			return scanDocs
		}
		records, err := rq.Collect()
		if err != nil {
			log.Error().Msg("some error 3")
			return scanDocs
		}
		for _, record := range records {
			if record.Values[0] == nil {
				log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
				continue
			}
			scanStatusDocument := record.Values[0].(dbtype.Node)
			var tmp SecretDoc
			utils.FromMap(scanStatusDocument.Props, &tmp)
			scanDocs = append(scanDocs, tmp)
		}
	}

	return scanDocs
}

func GeneratePDFReport(msg *message.Message) error {
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
	defer session.Close()

	tx, err := session.BeginTransaction()
	if err != nil {
		log.Error().Msg("some error 3")
	}
	defer tx.Close()

	secretDocCountLevel := SecretDocumentsLevel(ctx, tx, []Filter{})
	secretDocuments := SecretDocuments(ctx, tx, []Filter{})

	log.Info().Msgf("%+v %+v", secretDocCountLevel, secretDocuments)

	// var t *template.Template

	secretFileNames := []string{"secret/detailed_report_applied_filter.gohtml", "secret/detailed_report_nodewise_secret.gohtml", "secret/detailed_report_nodewise_vulnerability_count.gohtml", "secret/detailed_report_security_report_base.gohtml", "secret/detailed_secret_summary_table.gohtml", "secret/summary_report_header.gohtml"}
	t := template.Must(template.ParseFS(content, secretFileNames...))

	var b bytes.Buffer

	nodeDoc := &NodeWiseSeverityCountDoc{
		NodeWiseSeverityCount: map[string]map[string]int64{
			"47e915c47511ef211d80b817c87dd81aa83d6bd6b31e315c3eeca6a86b49ec3a-1677171997": secretDocCountLevel,
		},
		NodeWiseSeverityData: secretDocuments,
	}

	data2 := &Info2{
		Title:     "Deepfence",
		StartTime: "2-7-2023",
		EndTime:   "2-7-2023",
		AppliedFilters: []Filter{
			Filter{
				Type_:           "type",
				TypeInformation: "container_image",
			},
		},
		OverallSeveritySummary: "Total Count Severity-Wise",
		SeverityCount: secretDocCountLevel,
		NodeWiseSeverityCountData: []NodeWiseSeverityCountDoc{*nodeDoc},
	}

	err = t.ExecuteTemplate(&b, "detailed_report_security_report_base.gohtml", data2)
	if err != nil {
		log.Error().Err(err)
		return err
	}

	pdfg, err := pdf.NewPDFGenerator()
	if err != nil {
		log.Error().Err(err)
		return err
	}

	pdfg.Grayscale.Set(false)
	page := pdf.NewPageReader(&b)
	page.FooterRight.Set("[page]")

	// Add to document
	pdfg.AddPage(page)

	// Create PDF document in internal buffer
	err = pdfg.Create()
	if err != nil {
		log.Error().Err(err)
		return err
	}

	fmt.Println("Done")
	if err = os.MkdirAll("/tmp/"+reportPayload.ReportID, os.ModePerm); err != nil {
		log.Error().Msg("while making the folder")
		return err
	}

	secretFilename := fmt.Sprintf("/tmp/%s/secret-scan.pdf", reportPayload.ReportID)
	// Write buffer contents to file on disk
	err = pdfg.WriteFile(secretFilename)
	if err != nil {
		log.Error().Err(err)
		return err
	}

	byteBuffer, err := os.ReadFile(secretFilename)
	if err != nil {
		log.Error().Err(err).Msg("ReadFile")
		return err
	}

	mc, err := directory.MinioClient(ctx)
	if err != nil {
		log.Error().Msg(err.Error())
		return err
	}

	file := path.Join("/report/", reportPayload.ReportID, "/secret-scan.pdf")
	res, err := mc.UploadFile(ctx, file, byteBuffer,
		minio.PutObjectOptions{ContentType: "application/pdf"})
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

	_, err = tx.Run("match (n:REPORT:PDF {report_id: $uid}) set n.url = $url, n.finished_at = $finishedAt, n.status = $status return n", map[string]interface{}{"uid": reportPayload.ReportID, "url": reportPayload.FileURL, "finishedAt": reportPayload.FinishedAt, "status": reportPayload.Status})

	if err != nil {
		log.Error().Msg("something happened while saving it to db")
	}

	tx.Commit()

	return err
}

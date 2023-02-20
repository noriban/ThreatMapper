package report

import (
	"bytes"
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

	// "github.com/deepfence/ThreatMapper/deepfence_utils/directory"
	// "github.com/deepfence/ThreatMapper/deepfence_utils/log"

	pdf "github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/deepfence/ThreatMapper/deepfence_server/model"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
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
	SeverityCount             map[string]int
	NodeWiseSeverityCountData []NodeWiseSeverityCountDoc
}

type NodeWiseSeverityCountDoc struct {
	NodeWiseSeverityCount map[string]map[string]int
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
	Timestamp             string   `json:"@timestamp"`
	ContainerName         string   `json:"container_name"`
	ScanID                string   `json:"scan_id"`
	RelativeStartingIndex int      `json:"relative_starting_index"`
	HostName              string   `json:"host_name"`
	NodeID                string   `json:"node_id"`
}

type Filter struct {
	Type_           string
	TypeInformation string
}

//go:embed secret/*.gohtml
var content embed.FS

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

	_, err = rq.Collect()

	if err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	// var t *template.Template

	mydir, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("this is current wotking dir", mydir)
	secretFileNames := []string{"secret/detailed_report_applied_filter.gohtml", "secret/detailed_report_nodewise_secret.gohtml", "secret/detailed_report_nodewise_vulnerability_count.gohtml", "secret/detailed_report_security_report_base.gohtml", "secret/detailed_secret_summary_table.gohtml", "secret/summary_report_header.gohtml"}
	t := template.Must(template.ParseFS(content, secretFileNames...))

	var b bytes.Buffer

	doc := &SecretDoc{
		Identity:              10,
		Labels:                []string{"Secret"},
		FullFilename:          "deepfence/bin/secret-scanner/config.yaml",
		ImageLayerID:          "",
		Level:                 "high",
		KubernetesClusterName: "",
		Masked:                "false",
		StartingIndex:         12809,
		RelativeEndingIndex:   27,
		NodeName:              "mukul-test",
		Score:                 7.51,
		MatchedContent:        "regex: sshpass -p.*[|\\\\\\\\",
		NodeType:              "host",
		Timestamp:             "2023-01-11T15:49:50.388000000[UTC]",
		ContainerName:         "",
		ScanID:                "mukul-test-1673452184",
		RelativeStartingIndex: 13,
		HostName:              "mukul-test",
		NodeID:                "111:mukul-test:deepfence/bin/secret-scanner/config.yaml",
	}

	nodeDoc := &NodeWiseSeverityCountDoc{
		NodeWiseSeverityCount: map[string]map[string]int{
			"122565780891.dkr.ecr.us-east-1.amazonaws.com/dvwa:latest": map[string]int{
				"high":     0,
				"low":      1,
				"medium":   2,
				"critical": 3,
				"total":    6,
			},
		},
		NodeWiseSeverityData: []SecretDoc{*doc},
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
		SeverityCount: map[string]int{
			"high":     0,
			"low":      1,
			"medium":   2,
			"critical": 3,
		},
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

	// pdfg.Dpi.Set(300)
	// pdfg.Orientation.Set(pdf.OrientationLandscape)
	pdfg.Grayscale.Set(false)
	// fmt.Println(b.String())
	page := pdf.NewPageReader(&b)
	page.FooterRight.Set("[page]")
	// page.FooterFontSize.Set(10)
	// page.Zoom.Set(0.95)

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

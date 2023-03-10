package cronjobs

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/deepfence/golang_deepfence_sdk/utils/utils"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"
	gomail "gopkg.in/gomail.v2"
)

type Secret struct {
	StartingIndex         int32  `json:"starting_index" required:"true"`
	RelativeStartingIndex int32  `json:"relative_starting_index" required:"true"`
	RelativeEndingIndex   int32  `json:"relative_ending_index" required:"true"`
	FullFilename          string `json:"full_filename" required:"true"`
	MatchedContent        string `json:"matched_content" required:"true"`
	Masked                string `json:"masked" required:"true"`
	UpdatedAt             int64  `json:"updated_at" required:"true"`
}

type NotificationDocs[T any] struct {
	Docs []T
}

type SlackPayload struct {
	Text string `json:"text"`
}

type Payload[T any] struct {
	Text []T `json:"text"`
}

func sendNotification[T any](documents NotificationDocs[T], notificationType string) error {
	if len(documents.Docs) == 0 {
		return nil
	}
	if notificationType == "slack" {
		sendNotificationToSlack(documents.Docs)
	} else if notificationType == "sumo" {
		sendNotificationToSumoLogic(documents.Docs)
	} else if notificationType == "email" {
		sendNotificationToEmail(documents.Docs)
	} else if notificationType == "httpEndpoint" {
		sendNotificationToHttpEndpoint(documents.Docs)
	}
	return nil
}

func sendNotificationToSlack[T any](documents []T) error {
	url := ""
	method := "POST"
	// payload := strings.NewReader(`{"text": "This is a line of text in a channel.\nAnd this is another line of text."}`)
	bytes, _ := json.Marshal(documents)
	myPayload := SlackPayload{
		Text: string(bytes),
	}

	finalPayload, _ := json.Marshal(myPayload)
	log.Info().Msgf(" all scan payload %+v", string(finalPayload))
	payload := strings.NewReader(string(finalPayload))

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Cookie", "b=9dhn2fm5nkc404lgivsw20c2z")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println(string(body))
	return nil
}

func sendNotificationToSumoLogic[T any](documents []T) error {
	url := ""
	method := "POST"
	// payload := strings.NewReader(`{"text": "This is a line of text in a channel.\nAnd this is another line of text."}`)
	bytes, _ := json.Marshal(documents)
	myPayload := SlackPayload{
		Text: string(bytes),
	}

	finalPayload, _ := json.Marshal(myPayload)
	log.Info().Msgf(" all scan payload %+v", string(finalPayload))
	payload := strings.NewReader(string(finalPayload))

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Cookie", "b=9dhn2fm5nkc404lgivsw20c2z")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println(string(body))
	return nil
}

func sendNotificationToEmail[T any](documents []T) error {
	bytes, _ := json.MarshalIndent(documents, "", "\t")

	from := "mukul.ietlucknow@gmail.com"
	password := ""

	toEmailAddress := "mukul.ietlucknow@gmail.com"

	msg := gomail.NewMessage()
	msg.SetHeader("From", from)
	msg.SetHeader("To", toEmailAddress)
	msg.SetHeader("Subject", "Secret Scan")
	msg.SetBody("text/html", string(bytes))

	n := gomail.NewDialer("smtp.gmail.com", 587, from, password)

	// Send the email
	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}

	return nil

}

func sendNotificationToHttpEndpoint[T any](documents []T) error {
	url := "http://142.93.178.37:8000"
	method := "POST"

	myPayload := Payload[T]{
		Text: documents,
	}

	finalPayload, _ := json.MarshalIndent(myPayload, "", "\t")
	payload := strings.NewReader(string(finalPayload))

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Cookie", "b=9dhn2fm5nkc404lgivsw20c2z")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println(string(body))
	return nil
}

func makeTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

func SendNotification(msg *message.Message) error {
	log.Info().Msg("it is running")

	namespace := msg.Metadata.Get(directory.NamespaceKey)
	ctx := directory.NewContextWithNameSpace(directory.NamespaceID(namespace))

	clientNeo, err := directory.Neo4jClient(ctx)
	if err != nil {
		log.Error().Msg("error 1")
		log.Error().Msgf("%s", err)
		return err
	}

	session := clientNeo.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
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

	err = ExtractAndSendNotification[Secret](ctx, tx, utils.NEO4J_SECRET_SCAN)
	if err != nil {
		return err
	}
	// err = ExtractAndSendNotification[model.Vulnerability](ctx, tx, utils.NEO4J_VULNERABILITY_SCAN)
	// if err != nil {
	// 	return err
	// }
	// err = ExtractAndSendNotification[model.Malware](ctx, tx, utils.NEO4J_MALWARE_SCAN)
	// if err != nil {
	// 	return err
	// }
	// err = ExtractAndSendNotification[model.Compliance](ctx, tx, utils.NEO4J_COMPLIANCE_SCAN)
	// if err != nil {
	// 	return err
	// }
	// err = ExtractAndSendNotification[model.CloudCompliance](ctx, tx, utils.NEO4J_CLOUD_COMPLIANCE_SCAN)
	// if err != nil {
	// 	return err
	// }

	return nil

}

func ExtractAndSendNotification[T any](ctx context.Context, tx neo4j.Transaction, scan_type utils.Neo4jScanType) error {

	currentEpochtime := makeTimestamp() - 30000

	log.Info().Msgf("time is %d", currentEpochtime)

	rq, err := tx.Run(`MATCH (n:`+string(scan_type)+`) where n.updated_at >= $timefrom and n.status = 'COMPLETE' return n`, map[string]interface{}{
		"timefrom": currentEpochtime,
	})

	if err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	records, err := rq.Collect()

	if err != nil {
		log.Error().Msg("some error 3")
		return err
	}

	var scanIds []string
	for _, record := range records {
		log.Info().Msg("it has come to the records")
		if record.Values[0] == nil {
			log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
			continue
		}

		scanStatusDocument := record.Values[0].(dbtype.Node)

		log.Info().Msgf("%s", scanStatusDocument.Props["node_id"])
		scanId := fmt.Sprintf("%s", scanStatusDocument.Props["node_id"])
		scanIds = append(scanIds, scanId)
	}
	
	log.Info().Msgf("scan ids %v", scanIds)
	scanIds = []string{"47e915c47511ef211d80b817c87dd81aa83d6bd6b31e315c3eeca6a86b49ec3a-1677171997"}
	log.Info().Msgf("scan ids %v", scanIds)

	scanDocs := []Secret{}
	for _, id := range scanIds {
		log.Info().Msgf("scan ids %v", id)
		rq, err = tx.Run("MATCH (n:Secret) where n.scan_id = $id return n", map[string]interface{}{
			"id": id,
		})

		if err != nil {
			log.Error().Msg("some error 3")
			return err
		}

		records, err := rq.Collect()

		if err != nil {
			log.Error().Msg("some error 3")
			return err
		}

		for _, record := range records {
			// log.Info().Msg("it has come to the records")
			if record.Values[0] == nil {
				log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
				continue
			}

			scanStatusDocument := record.Values[0].(dbtype.Node)
			var tmp Secret
			utils.FromMap(scanStatusDocument.Props, &tmp)
			scanDocs = append(scanDocs, tmp)
			// log.Info().Msgf("%s", scanStatusDocument.Props)

		}
		// entries, _, err := reporters_scan.GetScanResults[T](ctx, scan_type, id, reporters.FieldsFilters{}, model.FetchWindow{Offset: 0, Size: 0})
		// log.Info().Msgf(" all the documents those are there %+v", scanDocs)

	}

	// entries, err := reporters_search.SearchReport[T](ctx, req.NodeFilter, 0)
	var notificationDocs = NotificationDocs[Secret]{
		Docs: scanDocs,
	}

	return sendNotification(notificationDocs, "httpEndpoint2")
}

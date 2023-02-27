package cronjobs

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/deepfence/ThreatMapper/deepfence_server/model"
	"github.com/deepfence/ThreatMapper/deepfence_server/reporters"
	reporters_scan "github.com/deepfence/ThreatMapper/deepfence_server/reporters/scan"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/deepfence/golang_deepfence_sdk/utils/utils"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"
)

type NotificationDocs[T any] struct {
	Docs []T
}

type SlackPayload struct {
	Text string `json:"text"`
}

func sendNotification[T any](documents NotificationDocs[T], notificationType string) error {
	if len(documents.Docs) == 0 {
		return nil
	}
	if notificationType == "slack" {
		sendNotificationToSlack[model.Secret](documents.Docs)
	} else if notificationType == "sumo" {
		sendNotificationToSumoLogic(documents)
	}
	return nil
}

func sendNotificationToSlack[T any](documents []interface{}) error {
	url := "https://hooks.slack.com/services/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"
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

func sendNotificationToSumoLogic(documents []interface{}) error {
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

	session := clientNeo.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
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

	currentEpochtime := makeTimestamp() - 30000

	log.Info().Msgf("time is %d", currentEpochtime)

	rq, err := tx.Run("MATCH (n:SecretScan) where n.updated_at >= $timefrom and n.status = 'COMPLETE' return n", map[string]interface{}{
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

	scanDocs := []model.Secret{}
	for _, id := range scanIds {
		log.Info().Msgf("scan ids %v", id)
		// rq, err = tx.Run("MATCH (n:Secret) where n.scan_id = $id return n", map[string]interface{}{
		// 	"id": id,
		// })

		// if err != nil {
		// 	log.Error().Msg("some error 3")
		// 	return err
		// }

		// records, err := rq.Collect()

		// if err != nil {
		// 	log.Error().Msg("some error 3")
		// 	return err
		// }

		// for _, record := range records {
		// 	log.Info().Msg("it has come to the records")
		// 	if record.Values[0] == nil {
		// 		log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
		// 		continue
		// 	}

		// 	scanStatusDocument := record.Values[0].(dbtype.Node)
		// 	var tmp model.Secret
		// 	utils.FromMap(scanStatusDocument.Props, &tmp)
		// 	scanDocs = append(scanDocs, tmp)
		// 	log.Info().Msgf("%s", scanStatusDocument.Props)

		// }
		entries, _, err := reporters_scan.GetScanResults[model.Secret](ctx, utils.NEO4J_SECRET_SCAN, id, reporters.FieldsFilters{}, model.FetchWindow{Offset: 0, Size: 0})

		if err != nil{
			log.Error().Msg("some error 3")
		}
		scanDocs = entries
	}

	// entries, err := reporters_search.SearchReport[T](ctx, req.NodeFilter, 0)
	

	var notificationDocs = NotificationDocs[model.Secret]{
		Docs: scanDocs,
	}

	sendNotification[model.Secret](notificationDocs, "slack")
	return nil

}

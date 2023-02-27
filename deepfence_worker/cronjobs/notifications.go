package cronjobs

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j/dbtype"
)

type NotificationDocs struct {
	Docs []interface{}
}

type SlackPayload struct {
	Text string `json:"text"`
}

func (documents *NotificationDocs) sendNotification(notificationType string) error {
	if len(documents.Docs) == 0 {
		return nil
	}
	if notificationType == "slack" {
		sendNotificationToSlack(documents.Docs)
	} else if  (notificationType == "sumo") {
		sendNotificationToSumoLogic(documents.Docs)
	}
	return nil
}

func sendNotificationToSlack(documents []interface{}) error {
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

	scanDocs := make(map[string][]interface{})
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
			log.Info().Msg("it has come to the records")
			if record.Values[0] == nil {
				log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
				continue
			}

			scanStatusDocument := record.Values[0].(dbtype.Node)
			scanDocs["text"] = append(scanDocs["text"], scanStatusDocument.Props)
			log.Info().Msgf("%s", scanStatusDocument.Props)

		}
	}

	// log.Info().Msgf(" all scan documents %+v", scanDocs)

	var notificationDocs = NotificationDocs{
		Docs: scanDocs["text"],
	}

	(&notificationDocs).sendNotification("slack")
	return nil

}

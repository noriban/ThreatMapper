package report

import (
	"fmt"
	"errors"
	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
)

func GenerateReport(msg *message.Message) error{
	var err error
	log.Info().Msg("Generating report")
	fmt.Println("generating report")
	tenantID := msg.Metadata.Get(directory.NamespaceKey)
	if len(tenantID) == 0 {
		log.Error().Msg("tenant-id/namespace is empty")
		return errors.New("tenant-id/namespace is empty")
	}
	return err
}



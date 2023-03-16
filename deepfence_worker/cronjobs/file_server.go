package cronjobs

import (
	"time"

	"github.com/ThreeDotsLabs/watermill/message"
	agentdiagnosis "github.com/deepfence/ThreatMapper/deepfence_server/diagnosis/agent-diagnosis"
	consolediagnosis "github.com/deepfence/ThreatMapper/deepfence_server/diagnosis/console-diagnosis"
	"github.com/deepfence/golang_deepfence_sdk/utils/directory"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
	"github.com/minio/minio-go/v7"
)

func CleanUpDiagnosisLogs(msg *message.Message) error {
	namespace := msg.Metadata.Get(directory.NamespaceKey)
	ctx := directory.NewContextWithNameSpace(directory.NamespaceID(namespace))

	mc, err := directory.MinioClient(ctx)
	if err != nil {
		return err
	}

	oneHourAgo := time.Now().Add(time.Duration(-1) * time.Hour)

	cleanup := func(pathPrefix string) {
		objects := mc.ListFiles(ctx, pathPrefix, false, 0, true)
		for _, obj := range objects {
			if obj.Expires.Before(oneHourAgo) {
				err = mc.DeleteFile(ctx, obj.Key, false, minio.RemoveObjectOptions{ForceDelete: true})
				if err != nil {
					log.Warn().Msg(err.Error())
				}
			}
		}
	}
	cleanup(consolediagnosis.ConsoleDiagnosisFileServerPrefix)
	cleanup(agentdiagnosis.AgentDiagnosisFileServerPrefix)

	return nil
}

package main

import (
	"flag"
	"os"
	"time"

	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	"sigs.k8s.io/controller-runtime/pkg/client/config"
	"sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
	"sigs.k8s.io/controller-runtime/pkg/manager"
	"sigs.k8s.io/controller-runtime/pkg/manager/signals"
	"sigs.k8s.io/controller-runtime/pkg/webhook"
)

func init() {
	log.SetLogger(zap.New())
}

type WebhookParams struct {
	certDir string
	port    int
	console string
	apiKey  string
}

func main() {
	entryLog := log.Log.WithName("entrypoint")

	var params WebhookParams

	flag.IntVar(&params.port, "port", 8443, "Webhook port")
	flag.StringVar(&params.certDir, "certs-path", "/certs/", "Webhook certificate folder")
	flag.StringVar(&params.console, "console-url", "", "management console url")
	flag.StringVar(&params.apiKey, "api-key", "", "console api key")
	flag.Parse()

	entryLog.Info("params", "console", params.console)
	entryLog.Info("params", "api-key", params.apiKey)

	// setup exit context
	exitCtx := signals.SetupSignalHandler()

	// Setup a Manager
	entryLog.Info("setting up manager")
	mgr, err := manager.New(config.GetConfigOrDie(), manager.Options{})
	if err != nil {
		entryLog.Error(err, "unable to set up overall controller manager")
		os.Exit(1)
	}

	// Setup webhooks
	entryLog.Info("setting up webhook server")
	hookServer := mgr.GetWebhookServer()
	hookServer.CertDir = params.certDir
	hookServer.Port = params.port

	entryLog.Info("registering webhooks to the webhook server")
	hookServer.Register(
		"/validate",
		&webhook.Admission{
			Handler: &imageValidator{
				Client:       mgr.GetClient(),
				log:          log.Log.WithName("webhook"),
				console:      params.console,
				accessTokens: NewApiToken(params.apiKey),
				cache:        NewCache(exitCtx, 60*time.Second),
				cacheTTL:     60 * time.Second,
			},
		},
	)

	entryLog.Info("starting manager")
	if err := mgr.Start(exitCtx); err != nil {
		entryLog.Error(err, "unable to run manager")
		os.Exit(1)
	}
}

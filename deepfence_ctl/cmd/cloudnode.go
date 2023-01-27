package cmd

import (
	"context"
	"github.com/deepfence/ThreatMapper/deepfence_ctl/output"

	"github.com/spf13/cobra"

	"github.com/deepfence/ThreatMapper/deepfence_ctl/http"
	deepfence_server_client "github.com/deepfence/golang_deepfence_sdk/client"
	"github.com/deepfence/golang_deepfence_sdk/utils/log"
)

var cloudNodeCmd = &cobra.Command{
	Use:   "cloud_node",
	Short: "res, _, err  control",
	Long:  `This subcommand controls cloud_node  with remote server`,
}

var cloudNodeStartSubCmd = &cobra.Command{
	Use:   "start",
	Short: "Start scan",
	Long:  `This subcommand triggers a scan remote server`,
	Run: func(cmd *cobra.Command, args []string) {

		cloud_account, _ := cmd.Flags().GetString("cloud_account")
		if cloud_account == "" {
			log.Fatal().Msg("Please provide a cloud_account")
		}

		cloud_provider, _ := cmd.Flags().GetString("cloud_provider")
		if cloud_provider == "" {
			log.Fatal().Msg("Please provide a cloud_provider")
		}

		node_id, _ := cmd.Flags().GetString("node_id")
		if node_id == "" {
			log.Fatal().Msg("Please provide a node_id")
		}

		var err error
		var res *deepfence_server_client.ModelCloudNodeAccountRegisterResp
		req := http.Client().CloudNodesApi.RegisterCloudNodeAccount(context.Background())
		req = req.ModelCloudNodeAccountRegisterReq(
			deepfence_server_client.ModelCloudNodeAccountRegisterReq{
				CloudAccount:  cloud_account,
				CloudProvider: cloud_provider,
				NodeId:        node_id,
			})
		res, _, err = http.Client().CloudNodesApi.RegisterCloudNodeAccountExecute(req)
		if err != nil {
			log.Fatal().Msgf("Fail to execute: %v", err)
		}
		output.Out(res)
	},
}

func init() {
	rootCmd.AddCommand(cloudNodeCmd)
	cloudNodeCmd.AddCommand(cloudNodeStartSubCmd)

	cloudNodeCmd.PersistentFlags().String("type", "", "Scan type")

	cloudNodeStartSubCmd.PersistentFlags().String("node-id", "", "Node id")
	cloudNodeStartSubCmd.PersistentFlags().String("cloud_account", "", "Cloud Account")
	cloudNodeStartSubCmd.PersistentFlags().String("cloud_provider", "", "CSP (AWS, GCP, AZURE)")

}

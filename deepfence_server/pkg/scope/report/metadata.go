package report

type Metadata struct {
	NodeID   string `json:"node_id"`
	NodeType string `json:"node_type"`
	NodeName string `json:"node_name"`

	// cloud metadata
	InstanceID        string   `json:"instance_id,omitempty"`
	CloudProvider     string   `json:"cloud_provider"`
	InstanceType      string   `json:"instance_type,omitempty"`
	PublicIP          []string `json:"public_ip,omitempty"`
	PrivateIP         []string `json:"private_ip,omitempty"`
	AvailabilityZone  string   `json:"availability_zone,omitempty"`
	KernelId          string   `json:"kernel_id,omitempty"`
	Region            string   `json:"region,omitempty"`
	ResourceGroupName string   `json:"resource_group_name,omitempty"`

	// common
	Uptime          int               `json:"uptime,omitempty"`
	Pseudo          bool              `json:"pseudo"`
	Meta            string            `json:"meta,omitempty"`
	UserDefinedTags map[string]string `json:"user_defined_tags,omitempty"`
	Metrics         MetricRow         `json:"metrics,omitempty"`
	ProbeID         string            `json:"probe_id"`

	// host
	Version        string            `json:"version,omitempty"`
	AgentRunning   string            `json:"agent_running,omitempty"`
	KernelVersion  string            `json:"kernel_version,omitempty"`
	HostName       string            `json:"host_name,omitempty"`
	Os             string            `json:"os,omitempty"`
	LocalNetworks  []string          `json:"local_networks,omitempty"`
	InterfaceNames []string          `json:"interface_names,omitempty"`
	InterfaceIps   map[string]string `json:"interface_ips,omitempty"`
	IsConsoleVm    bool              `json:"is_console_vm,omitempty"`

	// docker
	DockerContainerCommand    string   `json:"docker_container_command,omitempty"`
	DockerContainerStateHuman string   `json:"docker_container_state_human,omitempty"`
	DockerContainerUptime     int      `json:"docker_container_uptime,omitempty"`
	DockerContainerNetworks   string   `json:"docker_container_networks,omitempty"`
	DockerContainerIps        []string `json:"docker_container_ips,omitempty"`
	DockerContainerCreated    string   `json:"docker_container_created,omitempty"`
	DockerContainerID         string   `json:"docker_container_id,omitempty"`
	DockerContainerState      string   `json:"docker_container_state,omitempty"`
	DockerContainerPorts      string   `json:"docker_container_ports,omitempty"`
	ContainerName             string   `json:"container_name,omitempty"`
	ContainerCount            int      `json:"container_count,omitempty"`

	ImageName              string `json:"image_name,omitempty"`
	ImageNameWithTag       string `json:"image_name_with_tag,omitempty"`
	ImageTag               string `json:"image_tag,omitempty"`
	DockerImageSize        string `json:"docker_image_size,omitempty"`
	DockerImageCreatedAt   string `json:"docker_image_created_at,omitempty"`
	DockerImageVirtualSize string `json:"docker_image_virtual_size,omitempty"`
	DockerImageID          string `json:"docker_image_id,omitempty"`

	// pod
	PodCount int    `json:"pod_count,omitempty"`
	PodName  string `json:"pod_name,omitempty"`

	// process
	Pid     int    `json:"pid,omitempty"`
	Cmdline string `json:"cmdline,omitempty"`
	Ppid    int    `json:"ppid,omitempty"`
	Threads int    `json:"threads,omitempty"`
	Process string `json:"process,omitempty"`

	// kubernetes
	KubernetesState              string `json:"kubernetes_state,omitempty"`
	KubernetesIP                 string `json:"kubernetes_ip,omitempty"`
	KubernetesPublicIP           string `json:"kubernetes_public_ip,omitempty"`
	KubernetesIngressIP          string `json:"kubernetes_ingress_ip,omitempty"`
	KubernetesNamespace          string `json:"kubernetes_namespace,omitempty"`
	KubernetesCreated            string `json:"kubernetes_created,omitempty"`
	KubernetesRestartCount       int    `json:"kubernetes_restart_count,omitempty"`
	KubernetesIsInHostNetwork    bool   `json:"kubernetes_is_in_host_network,omitempty"`
	KubernetesType               string `json:"kubernetes_type,omitempty"`
	KubernetesPorts              string `json:"kubernetes_ports,omitempty"`
	KubernetesNodeType           string `json:"kubernetes_node_type,omitempty"`
	KubernetesObservedGeneration int    `json:"kubernetes_observed_generation,omitempty"`
	KubernetesDesiredReplicas    int    `json:"kubernetes_desired_replicas,omitempty"`
	KubernetesStrategy           string `json:"kubernetes_strategy,omitempty"`
	KubernetesSnapshotData       string `json:"kubernetes_snapshot_data,omitempty"`
	KubernetesVolumeClaim        string `json:"kubernetes_volume_claim,omitempty"`
	KubernetesVolumeCapacity     string `json:"kubernetes_volume_capacity,omitempty"`
	KubernetesVolumeName         string `json:"kubernetes_volume_name,omitempty"`
	KubernetesVolumeSnapshotName string `json:"kubernetes_volume_snapshot_name,omitempty"`
	KubernetesProvisioner        string `json:"kubernetes_provisioner,omitempty"`
	KubernetesName               string `json:"kubernetes_name,omitempty"`
	KubernetesStorageClassName   string `json:"kubernetes_storage_class_name,omitempty"`
	KubernetesAccessModes        string `json:"kubernetes_access_modes,omitempty"`
	KubernetesStatus             string `json:"kubernetes_status,omitempty"`
	KubernetesStorageDriver      string `json:"kubernetes_storage_driver,omitempty"`
	KubernetesClusterId          string `json:"kubernetes_cluster_id,omitempty"`
	KubernetesClusterName        string `json:"kubernetes_cluster_name,omitempty"`
}

func (m Metadata) Merge(n Metadata) Metadata {
	return n
}

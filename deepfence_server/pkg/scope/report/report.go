package report

import (
	"fmt"
	"math/rand"
	"time"
)

// Names of the various topologies.
const (
	Endpoint          = "endpoint"
	Process           = "process"
	Container         = "container"
	Pod               = "pod"
	Service           = "service"
	Namespace         = "kubernetes_namespace"
	ContainerImage    = "container_image"
	CloudProvider     = "cloud_provider"
	CloudRegion       = "cloud_region"
	Host              = "host"
	Overlay           = "overlay"
	KubernetesCluster = "kubernetes_cluster"

	// Shapes used for different nodes
	Circle         = "circle"
	Triangle       = "triangle"
	Square         = "square"
	Pentagon       = "pentagon"
	Hexagon        = "hexagon"
	Heptagon       = "heptagon"
	Octagon        = "octagon"
	Cloud          = "cloud"
	Storage        = "storage"
	Cylinder       = "cylinder"
	DottedCylinder = "dottedcylinder"
	StorageSheet   = "sheet"
	Camera         = "camera"
	DottedTriangle = "dottedtriangle"
)

// topologyNames are the names of all report topologies.
var topologyNames = []string{
	Endpoint,
	Process,
	Container,
	ContainerImage,
	CloudProvider,
	CloudRegion,
	KubernetesCluster,
	Pod,
	Service,
	Namespace,
	Host,
	Overlay,
}

// Report is the core data type. It's produced by probes, and consumed and
// stored by apps. It's composed of multiple topologies, each representing
// a different (related, but not equivalent) view of the network.
type Report struct {
	// TS is the time this report was generated
	TS time.Time

	// Endpoint nodes are individual (address, port) tuples on each host.
	// They come from inspecting active connections and can (theoretically)
	// be traced back to a process. Edges are present.
	Endpoint Topology

	// Process nodes are processes on each host. Edges are not present.
	Process Topology

	// Container nodes represent all Docker containers on hosts running probes.
	// Metadata includes things like containter id, name, image id etc.
	// Edges are not present.
	Container Topology

	// CloudProvider nodes represent all cloud providers.
	// Metadata includes things like name etc. Edges are not
	// present.
	CloudProvider Topology

	// CloudRegion nodes represent all cloud regions.
	// Metadata includes things like name etc. Edges are not
	// present.
	CloudRegion Topology

	// KubernetesCluster nodes represent all Kubernetes clusters.
	// Metadata includes things like cluster id, name etc. Edges are not
	// present.
	KubernetesCluster Topology

	// Pod nodes represent all Kubernetes pods running on hosts running probes.
	// Metadata includes things like pod id, name etc. Edges are not
	// present.
	Pod Topology

	// Service nodes represent all Kubernetes services running on hosts running probes.
	// Metadata includes things like service id, name etc. Edges are not
	// present.
	Service Topology

	// Namespace nodes represent all Kubernetes Namespaces running on hosts running probes.
	// Metadata includes things like Namespace id, name, etc. Edges are not
	// present.
	Namespace Topology

	// ContainerImages nodes represent all Docker containers images on
	// hosts running probes. Metadata includes things like image id, name etc.
	// Edges are not present.
	ContainerImage Topology

	// Host nodes are physical hosts that run probes. Metadata includes things
	// like operating system, load, etc. The information is scraped by the
	// probes with each published report. Edges are not present.
	Host Topology

	// Overlay nodes are active peers in any software-defined network that's
	// overlaid on the infrastructure. The information is scraped by polling
	// their status endpoints. Edges are present.
	Overlay Topology

	DNS DNSRecords `json:"DNS,omitempty" deepequal:"nil==empty"`
	// Backwards-compatibility for an accident in commit 951629a / release 1.11.6.
	BugDNS DNSRecords `json:"nodes,omitempty"`

	// Window is the amount of time that this report purports to represent.
	// Windows must be carefully merged. They should only be added when
	// reports cover non-overlapping periods of time. By default, we assume
	// that's true, and add windows in merge operations. When that's not true,
	// such as in the app, we expect the component to overwrite the window
	// before serving it to consumers.
	Window time.Duration

	// Shortcut reports should be propagated to the UI as quickly as possible,
	// bypassing the usual spy interval, publish interval and app ws interval.
	Shortcut bool

	// ID a random identifier for this report, used when caching
	// rendered views of the report.  Reports with the same id
	// must be equal, but we don't require that equal reports have
	// the same id.
	ID string `deepequal:"skip"`
}

// MakeReport makes a clean report, ready to Merge() other reports into.
func MakeReport() Report {
	return Report{
		Endpoint: MakeTopology(),

		Process: MakeTopology().
			WithShape(Square).
			WithLabel("process", "processes"),

		Container: MakeTopology().
			WithShape(Hexagon).
			WithLabel("container", "containers"),

		ContainerImage: MakeTopology().
			WithShape(Hexagon).
			WithLabel("image", "images"),

		Host: MakeTopology().
			WithShape(Circle).
			WithLabel("host", "hosts"),

		CloudProvider: MakeTopology().
			WithShape(Circle).
			WithLabel("cloud provider", "cloud providers"),

		CloudRegion: MakeTopology().
			WithShape(Circle).
			WithLabel("cloud region", "cloud regions"),

		KubernetesCluster: MakeTopology().
			WithShape(KubernetesCluster).
			WithLabel("kubernetes cluster", "kubernetes clusters"),

		Pod: MakeTopology().
			WithShape(Pod).
			WithLabel("pod", "pods"),

		Service: MakeTopology().
			WithShape(Heptagon).
			WithLabel("service", "services"),

		Namespace: MakeTopology(),

		Overlay: MakeTopology().
			WithShape(Circle).
			WithLabel("peer", "peers"),

		DNS: DNSRecords{},

		Window: 0,
		ID:     fmt.Sprintf("%d", rand.Int63()),
	}
}

// WalkTopologies iterates through the Topologies of the report,
// potentially modifying them
func (r *Report) WalkTopologies(f func(*Topology)) {
	for _, name := range topologyNames {
		f(r.topology(name))
	}
}

// WalkNamedTopologies iterates through the Topologies of the report,
// potentially modifying them.
func (r *Report) WalkNamedTopologies(f func(string, *Topology)) {
	for _, name := range topologyNames {
		f(name, r.topology(name))
	}
}

// WalkPairedTopologies iterates through the Topologies of this and another report,
// potentially modifying one or both.
func (r *Report) WalkPairedTopologies(o *Report, f func(*Topology, *Topology)) {
	for _, name := range topologyNames {
		f(r.topology(name), o.topology(name))
	}
}

// topology returns a reference to one of the report's topologies,
// selected by name.
func (r *Report) topology(name string) *Topology {
	switch name {
	case Endpoint:
		return &r.Endpoint
	case Process:
		return &r.Process
	case Container:
		return &r.Container
	case ContainerImage:
		return &r.ContainerImage
	case CloudProvider:
		return &r.CloudProvider
	case CloudRegion:
		return &r.CloudRegion
	case KubernetesCluster:
		return &r.KubernetesCluster
	case Pod:
		return &r.Pod
	case Service:
		return &r.Service
	case Namespace:
		return &r.Namespace
	case Host:
		return &r.Host
	case Overlay:
		return &r.Overlay
	}
	return nil
}

const (
	// HostNodeID is a metadata foreign key, linking a node in any topology to
	// a node in the host topology. That host node is the origin host, where
	// the node was originally detected.
	HostNodeID = "host_node_id"
	// ControlProbeID is the random ID of the probe which controls the specific node.
	ControlProbeID = "control_probe_id"
)

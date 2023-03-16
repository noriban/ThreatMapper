package report

import (
	"github.com/deepfence/golang_deepfence_sdk/utils/utils"
)

// Node describes a superset of the metadata that probes can collect
// about a given node in a given topology, along with the edges (aka
// adjacency) emanating from the node.
type Node struct {
	ID        string   `json:"id,omitempty"`
	Topology  string   `json:"topology,omitempty"`
	Adjacency IDList   `json:"adjacency,omitempty"`
	Metadata  Metadata `json:"metadata,omitempty"`
	Metrics   Metrics  `json:"metrics,omitempty" deepequal:"nil==empty"`
	Parents   Sets     `json:"parents,omitempty"`
}

// MakeNode creates a new Node with no initial metadata.
func MakeNode(id string) Node {
	return Node{
		ID:        id,
		Adjacency: MakeIDList(),
		Metadata:  Metadata{},
		Metrics:   Metrics{},
		Parents:   MakeSets(),
	}
}

// Merge mergses the individual components of a node and returns a
// fresh node.
func (n Node) Merge(other Node) Node {
	id := n.ID
	if id == "" {
		id = other.ID
	}
	topology := n.Topology
	if topology == "" {
		topology = other.Topology
	} else if other.Topology != "" && topology != other.Topology {
		panic("Cannot merge nodes with different topology types: " + topology + " != " + other.Topology)
	}
	return Node{
		ID:        id,
		Topology:  topology,
		Adjacency: n.Adjacency.Merge(other.Adjacency),
		Metadata:  n.Metadata.Merge(other.Metadata),
		Metrics:   n.Metrics.Merge(other.Metrics),
		Parents:   n.Parents.Merge(other.Parents),
	}
}

func (n *Node) ToDataMap() map[string]interface{} {
	res := utils.ToMap(n.Metadata)
	res["node_type"] = n.Topology
	res["node_id"] = n.ID
	return res
}

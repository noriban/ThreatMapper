package detailed

import (
	"github.com/deepfence/ThreatMapper/deepfence_server/pkg/scope/report"
)

// NodeSummaryGroup is a topology-typed group of children for a Node.
type NodeSummaryGroup struct {
	ID         string        `json:"id"`
	Label      string        `json:"label"`
	Nodes      []NodeSummary `json:"nodes"`
	TopologyID string        `json:"topologyId"`
	Columns    []Column      `json:"columns"`
}

// Column provides special json serialization for column ids, so they include
// their label for the frontend.
type Column struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	DefaultSort bool   `json:"defaultSort"`
	Datatype    string `json:"dataType"`
}

// BasicNodeSummary is basic summary information about a Node,
// sufficient for rendering links to the node.
type BasicNodeSummary struct {
	ID         string `json:"id"`
	Label      string `json:"label"`
	LabelMinor string `json:"labelMinor,omitempty"`
	Rank       string `json:"rank,omitempty"`
	Image      string `json:"image,omitempty"`
	Shape      string `json:"shape,omitempty"`
	Tag        string `json:"tag,omitempty"`
	Stack      bool   `json:"stack,omitempty"`
	Pseudo     bool   `json:"pseudo,omitempty"`
}

// NodeSummary is summary information about a Node.
type NodeSummary struct {
	BasicNodeSummary
	Metadata          []report.MetadataRow `json:"metadata,omitempty"`
	Metrics           []report.MetricRow   `json:"metrics,omitempty"`
	Adjacency         report.IDList        `json:"adjacency,omitempty"`
	ImmediateParentID string               `json:"immediate_parent_id"`
	Type              string               `json:"type"`
}

// NodeSummaries is a set of NodeSummaries indexed by ID.
type NodeSummaries map[string]NodeSummary

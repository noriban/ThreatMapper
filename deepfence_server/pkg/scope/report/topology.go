package report

import (
	"fmt"
	"strings"
)

// Topology describes a specific view of a network. It consists of
// nodes with metadata, and edges. Edges are directional, and embedded
// in the Node struct.
type Topology struct {
	Shape       string `json:"shape,omitempty"`
	Tag         string `json:"tag,omitempty"`
	Label       string `json:"label,omitempty"`
	LabelPlural string `json:"label_plural,omitempty"`
	Nodes       Nodes  `json:"nodes,omitempty" deepequal:"nil==empty"`
}

// MakeTopology gives you a Topology.
func MakeTopology() Topology {
	return Topology{
		Nodes: map[string]Node{},
	}
}

// WithShape sets the shape of nodes from this topology, returning a new topology.
func (t Topology) WithShape(shape string) Topology {
	return Topology{
		Shape:       shape,
		Tag:         t.Tag,
		Label:       t.Label,
		LabelPlural: t.LabelPlural,
		Nodes:       t.Nodes.Copy(),
	}
}

// WithLabel sets the label terminology of this topology, returning a new topology.
func (t Topology) WithLabel(label, labelPlural string) Topology {
	return Topology{
		Shape:       t.Shape,
		Tag:         t.Tag,
		Label:       label,
		LabelPlural: labelPlural,
		Nodes:       t.Nodes.Copy(),
	}
}

// AddNode adds node to the topology under key nodeID; if a
// node already exists for this key, nmd is merged with that node.
// This method is different from all the other similar methods
// in that it mutates the Topology, to solve issues of GC pressure.
func (t Topology) AddNode(node Node) {
	if existing, ok := t.Nodes[node.ID]; ok {
		node = node.Merge(existing)
	}
	t.Nodes[node.ID] = node
}

// ReplaceNode adds node to the topology under key nodeID; if a
// node already exists for this key, node replaces that node.
// Like AddNode, it mutates the Topology
func (t Topology) ReplaceNode(node Node) {
	t.Nodes[node.ID] = node
}

// GetShape returns the current topology shape, or the default if there isn't one.
func (t Topology) GetShape() string {
	if t.Shape == "" {
		return Circle
	}
	return t.Shape
}

// Copy returns a value copy of the Topology.
func (t Topology) Copy() Topology {
	return Topology{
		Shape:       t.Shape,
		Tag:         t.Tag,
		Label:       t.Label,
		LabelPlural: t.LabelPlural,
		Nodes:       t.Nodes.Copy(),
	}
}

// Merge merges the other object into this one, and returns the result object.
// The original is not modified.
func (t Topology) Merge(other Topology) Topology {
	shape := t.Shape
	if shape == "" {
		shape = other.Shape
	}
	label, labelPlural := t.Label, t.LabelPlural
	if label == "" {
		label, labelPlural = other.Label, other.LabelPlural
	}
	tag := t.Tag
	if tag == "" {
		tag = other.Tag
	}
	return Topology{
		Shape:       shape,
		Tag:         tag,
		Label:       label,
		LabelPlural: labelPlural,
		Nodes:       t.Nodes.Merge(other.Nodes),
	}
}

// UnsafeMerge merges the other object into this one, modifying the original.
func (t *Topology) UnsafeMerge(other Topology) {
	if t.Shape == "" {
		t.Shape = other.Shape
	}
	if t.Label == "" {
		t.Label, t.LabelPlural = other.Label, other.LabelPlural
	}
	if t.Tag == "" {
		t.Tag = other.Tag
	}
	t.Nodes.UnsafeMerge(other.Nodes)
}

// UnsafeUnMerge removes any information from t that would be added by merging other,
// modifying the original.
func (t *Topology) UnsafeUnMerge(other Topology) {
	if t.Shape == other.Shape {
		t.Shape = ""
	}
	if t.Label == other.Label && t.LabelPlural == other.LabelPlural {
		t.Label, t.LabelPlural = "", ""
	}
	if t.Tag == other.Tag {
		t.Tag = ""
	}
	t.Nodes.UnsafeUnMerge(other.Nodes)
}

// Nodes is a collection of nodes in a topology. Keys are node IDs.
// TODO(pb): type Topology map[string]Node
type Nodes map[string]Node

// Copy returns a value copy of the Nodes.
func (n Nodes) Copy() Nodes {
	if n == nil {
		return nil
	}
	cp := make(Nodes, len(n))
	for k, v := range n {
		cp[k] = v
	}
	return cp
}

// Merge merges the other object into this one, and returns the result object.
// The original is not modified.
func (n Nodes) Merge(other Nodes) Nodes {
	if len(other) > len(n) {
		n, other = other, n
	}
	if len(other) == 0 {
		return n
	}
	cp := n.Copy()
	cp.UnsafeMerge(other)
	return cp
}

// UnsafeMerge merges the other object into this one, modifying the original.
func (n *Nodes) UnsafeMerge(other Nodes) {
	for k, v := range other {
		if existing, ok := (*n)[k]; ok { // don't overwrite
			(*n)[k] = v.Merge(existing)
		} else {
			(*n)[k] = v
		}
	}
}

// UnsafeUnMerge removes nodes from n that would be added by merging other,
// modifying the original.
func (n *Nodes) UnsafeUnMerge(other Nodes) {
	for k, node := range *n {
		if otherNode, ok := (other)[k]; ok {
			remove := node.UnsafeUnMerge(otherNode)
			if remove {
				delete(*n, k)
			} else {
				(*n)[k] = node
			}
		}
	}
}

// Validate checks the topology for various inconsistencies.
func (t Topology) Validate() error {
	errs := []string{}

	// Check all nodes are valid, and the keys are parseable, i.e.
	// contain a scope.
	for nodeID, nmd := range t.Nodes {
		if _, _, ok := ParseNodeID(nodeID); !ok {
			errs = append(errs, fmt.Sprintf("invalid node ID %q", nodeID))
		}

		// Check all adjancency keys has entries in Node.
		for _, dstNodeID := range nmd.Adjacency {
			if _, ok := t.Nodes[dstNodeID]; !ok {
				errs = append(errs, fmt.Sprintf("node missing from adjacency %q -> %q", nodeID, dstNodeID))
			}
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("%d error(s): %s", len(errs), strings.Join(errs, "; "))
	}

	return nil
}

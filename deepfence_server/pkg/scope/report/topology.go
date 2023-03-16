package report

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

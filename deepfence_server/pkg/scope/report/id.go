package report

import (
	"strings"
)

// Delimiters are used to separate parts of node IDs, to guarantee uniqueness
// in particular contexts.
const (
	// ScopeDelim is a general-purpose delimiter used within node IDs to
	// separate different contextual scopes. Different topologies have
	// different key structures.
	ScopeDelim = ";"

	// EdgeDelim separates two node IDs when they need to exist in the same key.
	// Concretely, it separates node IDs in keys that represent edges.
	EdgeDelim = "|"

	// Key added to nodes to prevent them being joined with conntracked connections
	DoesNotMakeConnections = "does_not_make_connections"
)

// ParseEndpointNodeID produces the scope, address, and port and remainder.
// Note that scope may be blank.
func ParseEndpointNodeID(endpointNodeID string) (scope, address, port string, ok bool) {
	// Not using strings.SplitN() to avoid a heap allocation
	first := strings.Index(endpointNodeID, ScopeDelim)
	if first == -1 {
		return "", "", "", false
	}
	second := strings.Index(endpointNodeID[first+1:], ScopeDelim)
	if second == -1 {
		return "", "", "", false
	}
	return endpointNodeID[:first], endpointNodeID[first+1 : first+1+second], endpointNodeID[first+1+second+1:], true
}

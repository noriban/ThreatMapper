package render

import (
	"strings"

	"github.com/deepfence/ThreatMapper/deepfence_server/pkg/scope/report"
)

// Constants are used in the tests.
const (
	IncomingInternetID = "in-theinternet"
	OutgoingInternetID = "out-theinternet"
)

// IsInternetNode determines whether the node represents the Internet.
func IsInternetNode(n report.Node) bool {
	return n.ID == IncomingInternetID || n.ID == OutgoingInternetID
}

// MakePseudoNodeID joins the parts of an id into the id of a pseudonode
func MakePseudoNodeID(parts ...string) string {
	return strings.Join(append([]string{"pseudo"}, parts...), ":")
}

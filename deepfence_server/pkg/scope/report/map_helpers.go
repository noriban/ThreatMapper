package report

import (
	"bytes"
	"fmt"
	"sort"

	"github.com/deepfence/ThreatMapper/deepfence_server/pkg/scope/report/ps"
)

// very similar to ps.Map.String() but with keys sorted
func mapToString(m *ps.Tree) string {
	buf := bytes.NewBufferString("{")
	for _, Key := range mapKeys(m) {
		val, _ := m.Lookup(Key)
		fmt.Fprintf(buf, "%s: %s,\n", Key, val)
	}
	fmt.Fprintf(buf, "}")
	return buf.String()
}

func mapKeys(m *ps.Tree) []string {
	if m == nil {
		return nil
	}
	keys := m.Keys()
	sort.Strings(keys)
	return keys
}

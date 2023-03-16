package report

const (
	number = "number"
)

// FromLatest and friends denote the different fields where metadata can be
// gathered from.
const (
	FromLatest   = "latest"
	FromSets     = "sets"
	FromCounters = "counters"
)

// MetadataRow is a row for the metadata table.
type MetadataRow struct {
	ID       string      `json:"id"`
	Label    string      `json:"label"`
	Value    interface{} `json:"value"`
	Priority float64     `json:"priority,omitempty"`
	Datatype string      `json:"dataType,omitempty"`
	Truncate int         `json:"truncate,omitempty"`
}

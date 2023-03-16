package report

// DefaultFormat and friends tell the UI how to render the "Value" of this
// metric.
const (
	DefaultFormat  = ""
	FilesizeFormat = "filesize"
	IntegerFormat  = "integer"
	PercentFormat  = "percent"
)

// MetricRow is a tuple of data used to render a metric as a sparkline and
// accoutrements.
type MetricRow struct {
	ID         string
	Label      string
	Format     string
	Group      string
	Value      float64
	ValueEmpty bool
	Priority   float64
	URL        string
	Metric     *Metric
}

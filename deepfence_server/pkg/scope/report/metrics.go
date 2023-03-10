package report

import (
	"time"
)

// Metrics is a string->metric map.
type Metrics map[string]Metric

// Lookup the metric for the given key
func (m Metrics) Lookup(key string) (Metric, bool) {
	v, ok := m[key]
	return v, ok
}

// Merge merges two sets maps into a fresh set, performing set-union merges as
// appropriate.
func (m Metrics) Merge(other Metrics) Metrics {
	if len(other) > len(m) {
		m, other = other, m
	}
	if len(other) == 0 {
		return m
	}
	result := m.Copy()
	for k, v := range other {
		if rv, ok := result[k]; ok {
			result[k] = rv.Merge(v)
		} else {
			result[k] = v
		}
	}
	return result
}

// Copy returns a value copy of the sets map.
func (m Metrics) Copy() Metrics {
	result := make(Metrics, len(m))
	for k, v := range m {
		result[k] = v
	}
	return result
}

// Metric is a list of timeseries data with some metadata. Clients must use the
// Add method to add values.  Metrics are immutable.
type Metric struct {
	Samples Sample `json:"samples,omitempty"`
}

// Sample is a single datapoint of a metric.
type Sample struct {
	Timestamp time.Time `json:"date"`
	Value     float64   `json:"value"`
}

// MakeSingletonMetric makes a metric with a single value
func MakeSingletonMetric(t time.Time, v float64) Metric {
	return Metric{
		Samples: Sample{t, v},
	}

}

var emptyMetric = Metric{}

// MakeMetric makes a new Metric from unique samples incrementally ordered in
// time.
func MakeMetric(samples Sample) Metric {
	return Metric{
		Samples: samples,
	}
}

// Merge combines the two Metrics and returns a new result.
func (m Metric) Merge(other Metric) Metric {
	return other
}

// LastSample obtains the last sample of the metric
func (m Metric) LastSample() (Sample, bool) {
	return m.Samples, true
}

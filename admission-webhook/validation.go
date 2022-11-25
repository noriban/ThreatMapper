package main

import "fmt"

type Policies struct {
	ID              int             `json:"id"`
	Conditions      []Conditions    `json:"conditions"`
	Vulnerabilities Vulnerabilities `json:"vulnerabilities"`
	Action          string          `json:"action"`
}

type Conditions struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Vulnerabilities struct {
	Type      string   `json:"type"`
	Severity  string   `json:"severity"`
	Threshold int      `json:"threshold"`
	AllowList []string `json:"allow_list"`
	DenyList  []string `json:"deny_list"`
}

const (
	ActionDeny  = "deny"
	ActionAllow = "allow"
)

var (
	policiesList = &[]Policies{
		{
			ID:              1,
			Conditions:      []Conditions{{Key: "namespace", Value: "default"}},
			Vulnerabilities: Vulnerabilities{Type: "cve", Severity: "critical", Threshold: 1},
			Action:          "deny",
		},
	}
)

func countCVEBySeverity(cve *[]CVE, severity string) int {
	count := 0
	for _, c := range *cve {
		if c.CveSeverity == severity {
			count += 1
		}
	}
	return count
}

func matchConditions(conditions []Conditions, image string, namespace string, data []CVE) bool {
	for _, c := range conditions {
		if c.Key == "namespace" && c.Value == namespace {
			return true
		}
	}
	return false
}

func evaluate(policies *[]Policies, image string, namespace string, data []CVE) (bool, string) {
	for _, p := range *policies {
		if !matchConditions(p.Conditions, image, namespace, data) {
			continue
		}
		if p.Vulnerabilities.Type == "cve" {
			if len(p.Vulnerabilities.Severity) > 0 {
				sevCount := countCVEBySeverity(&data, p.Vulnerabilities.Severity)
				if sevCount > p.Vulnerabilities.Threshold {
					return false, fmt.Sprintf("%s %s count %d > %d",
						p.Vulnerabilities.Type, p.Vulnerabilities.Severity,
						sevCount, p.Vulnerabilities.Threshold)
				}
			}
		}
	}
	return true, ""
}

// validate image against data from console
func (v *imageValidator) isValidImage(image string, namespace string) (bool, string) {
	imageData := v.get(image)
	return evaluate(policiesList, image, namespace, imageData)
}

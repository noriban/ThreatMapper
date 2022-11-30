package main

import (
	"fmt"
	"sort"
	"strings"
)

const (
	DENY      = "deny"
	ALLOW     = "allow"
	NAMESPACE = "namespace"
	IMAGE     = "image"
	COUNT     = "count"
	CVE       = "cve"
	SECRET    = "secret"
	MALWARE   = "malware"
)

var (
	SupportedConditionKeys = []string{NAMESPACE, IMAGE, COUNT}
	SupportedOperators     = []Operator{
		Equals, In,
		NotEquals, NotIn,
		GreaterThan, LessThan,
	}
)

type Operator string

const (
	Equals      Operator = "=="
	In          Operator = "in"
	NotEquals   Operator = "!="
	NotIn       Operator = "notin"
	GreaterThan Operator = "gt"
	LessThan    Operator = "lt"
)

type Conditions []Condition

type Condition struct {
	Key      string   `json:"key"`
	Value    []string `json:"value"`
	Operator Operator `json:"operator"`
}

func (c *Condition) String() string {
	return fmt.Sprintf("%s %s %s", c.Key, c.Operator, c.Value)
}

type Policies struct {
	ID         int        `json:"id"`
	Conditions Conditions `json:"conditions"`
	Allowed    bool       `json:"allowed"`
}

var (
	policiesList = &[]Policies{
		{
			ID: 1,
			Conditions: []Condition{
				{Key: "namespace", Operator: In, Value: []string{"test"}},
			},
			Allowed: true,
		},
		{
			ID: 2,
			Conditions: []Condition{
				{Key: "image", Operator: In, Value: []string{"nginx:latest"}},
			},
			Allowed: false,
		},
	}
)

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func containsOperator(s []Operator, e Operator) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func countCVEBySeverity(cve *[]CVEFields, severity string) int {
	count := 0
	for _, c := range *cve {
		if c.CveSeverity == severity {
			count += 1
		}
	}
	return count
}

func (cs *Conditions) matchConditions(image string, namespace string, data []CVEFields) (bool, []string) {
	var (
		matchAll bool = false
		reason   []string
	)

	for _, c := range *cs {
		m := c.Matches(image, namespace, data)
		if !m {
			return false, []string{c.String()}
		} else {
			matchAll = true
			reason = append(reason, c.String())
		}
	}
	return matchAll, reason
}

func (c *Condition) hasValue(value string) bool {
	for i := range c.Value {
		if !strings.Contains(value, c.Value[i]) {
			continue
		} else {
			return true
		}
	}
	return false
}

func (c *Condition) Matches(image string, namespace string, data []CVEFields) bool {
	if !contains(SupportedConditionKeys, c.Key) {
		return false
	}
	if !containsOperator(SupportedOperators, c.Operator) {
		return false
	}

	switch c.Operator {
	case In, Equals:
		if c.Key == NAMESPACE {
			return c.hasValue(namespace)
		}
		if c.Key == IMAGE {
			return c.hasValue(image)
		}
	case NotIn, NotEquals:
		if c.Key == NAMESPACE {
			return !c.hasValue(namespace)
		}
		if c.Key == IMAGE {
			return !c.hasValue(image)
		}
	case GreaterThan, LessThan:
		return false
	default:
		return false
	}
	return false
}

func evaluate(policies []Policies, image string, namespace string, data []CVEFields) (bool, string) {
	sort.Slice(policies, func(i, j int) bool {
		return !(policies[i].Allowed && !policies[j].Allowed)
	})
	allowed := false
	reason := []string{}
	for _, p := range policies {
		ok, r := p.Conditions.matchConditions(image, namespace, data)
		if !ok {
			continue
		} else {
			allowed = (ok && p.Allowed)
			reason = append(reason, r...)
		}
	}
	return allowed, strings.Join(reason, ",")
}

// validate image against data from console
func (v *imageValidator) isValidImage(image string, namespace string) (bool, string) {
	imageData := v.get(image)
	return evaluate(*policiesList, image, namespace, imageData)
}

package main

import (
	"testing"
)

func Test_contains(t *testing.T) {
	type args struct {
		s []string
		e string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "contains",
			args: args{
				s: []string{"1", "2"},
				e: "1",
			},
			want: true,
		},
		{
			name: "does not contains",
			args: args{
				s: []string{"1", "2"},
				e: "3",
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := contains(tt.args.s, tt.args.e); got != tt.want {
				t.Errorf("contains() got %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_matchConditions(t *testing.T) {
	type args struct {
		conditions Conditions
		image      string
		namespace  string
		data       []CVEFields
	}
	tests := []struct {
		name    string
		args    args
		allowed bool
		reason  []string
	}{
		{
			name: "match",
			args: args{
				conditions: []Condition{
					{Key: "namespace", Operator: In, Value: []string{"test"}},
				},
				image:     "nginx:latest",
				namespace: "test",
			},
			allowed: true,
			reason:  nil,
		},
		{
			name: "does not match",
			args: args{
				conditions: Conditions{
					{Key: "namespace", Operator: In, Value: []string{"test"}},
				},
				image:     "nginx:latest",
				namespace: "default",
			},
			allowed: false,
			reason:  nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			allowed, reason := tt.args.conditions.matchConditions(tt.args.image, tt.args.namespace, tt.args.data)
			if allowed != tt.allowed {
				t.Errorf("matchConditions() got %v, want %v", allowed, tt.allowed)
				t.Errorf("matchConditions() got %v, want %v", reason, tt.reason)
			}
		})
	}
}

func TestCondition_hasValue(t *testing.T) {
	type fields struct {
		Key      string
		Value    []string
		Operator Operator
	}
	type args struct {
		value string
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		want   bool
	}{
		{
			name:   "has value",
			fields: fields{Key: "namespace", Operator: In, Value: []string{"test"}},
			args:   args{value: "test"},
			want:   true,
		},
		{
			name:   "does not has value",
			fields: fields{Key: "namespace", Operator: In, Value: []string{"default"}},
			args:   args{value: "test"},
			want:   false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Condition{
				Key:      tt.fields.Key,
				Value:    tt.fields.Value,
				Operator: tt.fields.Operator,
			}
			if got := r.hasValue(tt.args.value); got != tt.want {
				t.Errorf("Condition.hasValue() got %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCondition_Matches(t *testing.T) {
	type fields struct {
		Key      string
		Value    []string
		Operator Operator
	}
	type args struct {
		image     string
		namespace string
		data      []CVEFields
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		matches bool
	}{
		{
			name:    "matches",
			fields:  fields{Key: "namespace", Operator: In, Value: []string{"test"}},
			args:    args{image: "nginx:latest", namespace: "test", data: []CVEFields{}},
			matches: true,
		},
		{
			name:    "does not match",
			fields:  fields{Key: "namespace", Operator: In, Value: []string{"test"}},
			args:    args{image: "nginx:latest", namespace: "default", data: []CVEFields{}},
			matches: false,
		},
		{
			name:    "does not match 2",
			fields:  fields{Key: "image", Operator: NotIn, Value: []string{"nginx"}},
			args:    args{image: "nginx:latest", namespace: "default", data: []CVEFields{}},
			matches: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := &Condition{
				Key:      tt.fields.Key,
				Value:    tt.fields.Value,
				Operator: tt.fields.Operator,
			}
			matches := c.Matches(tt.args.image, tt.args.namespace, tt.args.data)
			if matches != tt.matches {
				t.Errorf("Condition.Matches() got %v, want %v", matches, tt.matches)
			}
		})
	}
}

func Test_evaluate(t *testing.T) {
	type args struct {
		policies  []Policies
		image     string
		namespace string
		data      []CVEFields
	}
	tests := []struct {
		name    string
		args    args
		allowed bool
		reason  string
	}{
		{
			name: "match",
			args: args{
				policies: []Policies{
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "namespace", Operator: In, Value: []string{"test"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: true,
			reason:  "namespace in [test]",
		},
		{
			name: "match multiple conditions",
			args: args{
				policies: []Policies{
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "namespace", Operator: In, Value: []string{"test"}},
							{Key: "image", Operator: In, Value: []string{"nginx"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: true,
			reason:  "namespace in [test],image in [nginx]",
		},
		{
			name: "match multiple policies 1",
			args: args{
				policies: []Policies{
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
							{Key: "image", Operator: In, Value: []string{"nginx"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: true,
			reason:  "image in [nginx],namespace in [test]",
		},
		{
			name: "match multiple policies 2",
			args: args{
				policies: []Policies{
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "namespace", Operator: In, Value: []string{"test"}},
						},
						Allowed: false,
					},
					{
						ID: 2,
						Conditions: []Condition{
							{Key: "image", Operator: In, Value: []string{"nginx"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: false,
			reason:  "namespace in [test]",
		},
		{
			name: "match multiple policies 3",
			args: args{
				policies: []Policies{
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
							{Key: "image", Operator: In, Value: []string{"nginx"}},
						},
						Allowed: false,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: false,
			reason:  "image in [nginx]",
		},
		{
			name: "does not match",
			args: args{
				policies: []Policies{
					{
						ID:         1,
						Conditions: []Condition{{Key: "namespace", Operator: In, Value: []string{"default"}}},
						Allowed:    true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: false,
			reason:  "",
		},
		{
			name: "does not match multiple conditions",
			args: args{
				policies: []Policies{
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "namespace", Operator: In, Value: []string{"test"}},
							{Key: "image", Operator: NotIn, Value: []string{"nginx"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "test",
				data:      []CVEFields{},
			},
			allowed: false,
			reason:  "",
		},
		{
			name: "does not match multiple policies",
			args: args{
				policies: []Policies{
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "namespace", Operator: In, Value: []string{"test"}},
						},
						Allowed: true,
					},
					{
						ID: 1,
						Conditions: []Condition{
							{Key: "image", Operator: NotIn, Value: []string{"nginx"}},
						},
						Allowed: true,
					},
				},
				image:     "nginx:latest",
				namespace: "default",
				data:      []CVEFields{},
			},
			allowed: false,
			reason:  "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			allowed, reason := evaluate(tt.args.policies, tt.args.image, tt.args.namespace, tt.args.data)
			if allowed != tt.allowed {
				t.Errorf("evaluate() got %v, want %v", allowed, tt.allowed)
			}
			if reason != tt.reason {
				t.Errorf("evaluate() got %v, want %v", reason, tt.reason)
			}
		})
	}
}

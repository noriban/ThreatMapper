package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/jellydator/ttlcache/v3"
)

type ImageSearchResponse struct {
	Data struct {
		Hits []struct {
			Index  string `json:"_index"`
			Source CVE    `json:"_source"`
			Type   string `json:"_type"`
		} `json:"hits"`
		Total int `json:"total"`
	} `json:"data"`
	Error   interface{} `json:"error"`
	Success bool        `json:"success"`
}

type CVE struct {
	CveID           string  `json:"cve_id"`
	CveOverallScore float64 `json:"cve_overall_score"`
	CveSeverity     string  `json:"cve_severity"`
}

type ImageSearchRequest struct {
	Type        string   `json:"_type"`
	Source      []string `json:"_source"`
	Filters     Filters  `json:"filters"`
	SortOrder   string   `json:"sort_order"`
	SortBy      string   `json:"sort_by"`
	NodeFilters struct{} `json:"node_filters"`
}

type Filters struct {
	Masked            []string `json:"masked"`
	CveContainerImage []string `json:"cve_container_image"`
}

func NewImageSearchRequest(image string) *ImageSearchRequest {
	return &ImageSearchRequest{
		Type:   "cve",
		Source: []string{"cve_id", "cve_severity", "cve_overall_score"},
		Filters: Filters{
			Masked:            []string{"false"},
			CveContainerImage: []string{image},
		},
		SortOrder: "desc",
		SortBy:    "@timestamp",
	}
}

var (
	httpClient = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
)

type dfApiAuthResponse struct {
	Data struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
	} `json:"data"`
	Error struct {
		Message string `json:"message"`
	} `json:"error"`
	Success bool `json:"success"`
}

func (v *imageValidator) GetAccessToken() (string, error) {
	url := fmt.Sprintf("https://%s/deepfence/v1.5/users/auth", v.console)
	body := bytes.NewReader([]byte(`{"api_key":"` + v.accessTokens.apiKey + `"}`))
	req, err := http.NewRequest(http.MethodPost, url, body)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	var authResp dfApiAuthResponse
	err = json.NewDecoder(resp.Body).Decode(&authResp)
	if err != nil {
		return "", err
	}
	if !authResp.Success {
		return "", errors.New(authResp.Error.Message)
	}
	v.accessTokens.access = authResp.Data.AccessToken
	v.accessTokens.refresh = authResp.Data.RefreshToken
	return authResp.Data.AccessToken, nil
}

// get image details from console
// cache image details for some time
func (v *imageValidator) fetchImageCVEDetails(image string) ([]CVE, error) {
	var cveData []CVE
	payload := NewImageSearchRequest(image)
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return cveData, err
	}
	body := bytes.NewReader(payloadBytes)

	url := fmt.Sprintf("https://%s/deepfence/v1.5/search?from=0&size=10000", v.console)
	req, err := http.NewRequest(http.MethodPost, url, body)
	if err != nil {
		return cveData, err
	}
	accessToken, err := v.GetAccessToken()
	if err != nil {
		return cveData, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return cveData, err
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return cveData, err
	}

	if resp.StatusCode == http.StatusOK {
		var respData ImageSearchResponse
		err = json.Unmarshal(respBody, &respData)
		if err != nil {
			return []CVE{}, err
		}
		for _, h := range respData.Data.Hits {
			cveData = append(cveData, h.Source)
		}
		return cveData, nil
	}
	return cveData, fmt.Errorf("%s", resp.Status)
}

func (v *imageValidator) get(image string) []CVE {
	item := v.cache.Get(image, ttlcache.WithDisableTouchOnHit[string, []CVE]())
	if item != nil {
		return item.Value()
	}
	v.log.Info("fetch data from console", "image", image)
	data, err := v.fetchImageCVEDetails(image)
	if err != nil {
		v.log.Error(err, fmt.Sprintf("failed to fetch data for image %s", image))
	}
	// set cache if data is not empty
	if len(data) > 0 {
		v.cache.Set(image, data, v.cacheTTL)
	}
	return data
}

// get image validation policies from console
// cache image validation policies
func (v *imageValidator) fetchImagePolicies() {}

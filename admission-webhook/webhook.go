package main

import (
	"context"
	"fmt"
	"time"

	"net/http"

	"github.com/go-logr/logr"
	"github.com/jellydator/ttlcache/v3"
	appsV1 "k8s.io/api/apps/v1"
	coreV1 "k8s.io/api/core/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/webhook/admission"
)

// imageValidator validates images in a pod
type imageValidator struct {
	log          logr.Logger
	Client       client.Client
	decoder      *admission.Decoder
	console      string
	cache        *ttlcache.Cache[string, []CVEFields]
	cacheTTL     time.Duration
	accessTokens *tokens
}

type tokens struct {
	apiKey  string
	access  string
	refresh string
}

func NewApiToken(apiKey string) *tokens {
	return &tokens{
		apiKey: apiKey,
	}
}

func isWebhookDisabled(strMap map[string]string) bool {
	if v, ok := strMap["deepfence.io/admission-webhook"]; ok {
		if v == "disabled" {
			return true
		}
	}
	return false
}

// imageValidator admits a pod if images in the containers pass validations
func (v *imageValidator) Handle(ctx context.Context, req admission.Request) admission.Response {
	switch req.AdmissionRequest.Kind.Kind {
	case "Pod":
		pod := &coreV1.Pod{}

		err := v.decoder.Decode(req, pod)
		if err != nil {
			return admission.Errored(http.StatusBadRequest, err)
		}

		if isWebhookDisabled(pod.Annotations) || isWebhookDisabled(pod.Labels) {
			v.log.Info("allowed", "pod", pod.Name, "namespace", pod.Namespace,
				"reason", "found label deepfence.io/admission-webhook=disabled")
			return admission.Allowed("")
		}

		for _, c := range pod.Spec.Containers {
			valid, reason := v.isValidImage(c.Image, pod.Namespace)
			if !valid {
				v.log.Info("denied", "pod", pod.Name, "image", c.Image,
					"reason", reason, "namespace", pod.Namespace)
				return admission.Denied(fmt.Sprintf("image: %s reason: %s", c.Image, reason))
			}
		}
		v.log.Info("allowed", "pod", pod.Name)
		return admission.Allowed("")

	case "Deployment":
		deployment := &appsV1.Deployment{}

		err := v.decoder.Decode(req, deployment)
		if err != nil {
			return admission.Errored(http.StatusBadRequest, err)
		}

		if isWebhookDisabled(deployment.Annotations) || isWebhookDisabled(deployment.Labels) {
			v.log.Info("allowed", "deployment", deployment.Name, "namespace", deployment.Namespace,
				"reason", "found label deepfence.io/admission-webhook=disabled")
			return admission.Allowed("")
		}

		for _, c := range deployment.Spec.Template.Spec.Containers {
			valid, reason := v.isValidImage(c.Image, deployment.Namespace)
			if !valid {
				v.log.Info("denied", "deployment", deployment.Name, "image", c.Image,
					"reason", reason, "namespace", deployment.Namespace)
				return admission.Denied(fmt.Sprintf("image: %s reason: %s", c.Image, reason))
			}
		}
		v.log.Info("allowed", "deployment", deployment.Name)
		return admission.Allowed("")

	case "StatefulSet":
		statefulset := &appsV1.StatefulSet{}

		err := v.decoder.Decode(req, statefulset)
		if err != nil {
			return admission.Errored(http.StatusBadRequest, err)
		}

		if isWebhookDisabled(statefulset.Annotations) || isWebhookDisabled(statefulset.Labels) {
			v.log.Info("allowed", "statefulset", statefulset.Name, "namespace", statefulset.Namespace,
				"reason", "found label deepfence.io/admission-webhook=disabled")
			return admission.Allowed("")
		}

		for _, c := range statefulset.Spec.Template.Spec.Containers {
			valid, reason := v.isValidImage(c.Image, statefulset.Namespace)
			if !valid {
				v.log.Info("denied", "statefulset", statefulset.Name, "image", c.Image,
					"reason", reason, "namespace", statefulset.Namespace)
				return admission.Denied(fmt.Sprintf("image: %s reason: %s", c.Image, reason))
			}
		}
		v.log.Info("allowed", "statefulset", statefulset.Name)
		return admission.Allowed("")

	case "DaemonSet":
		daemonset := &appsV1.StatefulSet{}

		err := v.decoder.Decode(req, daemonset)
		if err != nil {
			return admission.Errored(http.StatusBadRequest, err)
		}

		if isWebhookDisabled(daemonset.Annotations) || isWebhookDisabled(daemonset.Labels) {
			v.log.Info("allowed", "daemonset", daemonset.Name, "namespace", daemonset.Namespace,
				"reason", "found label deepfence.io/admission-webhook=disabled")
			return admission.Allowed("")
		}

		for _, c := range daemonset.Spec.Template.Spec.Containers {
			valid, reason := v.isValidImage(c.Image, daemonset.Namespace)
			if !valid {
				v.log.Info("denied", "daemonset", daemonset.Name, "image", c.Image,
					"reason", reason, "namespace", daemonset.Namespace)
				return admission.Denied(fmt.Sprintf("image: %s reason: %s", c.Image, reason))
			}
		}
		v.log.Info("allowed", "daemonset", daemonset.Name)
		return admission.Allowed("")

	default:
		return admission.Allowed("")
	}
}

// imageValidator implements admission.DecoderInjector.
// A decoder will be automatically injected.

// InjectDecoder injects the decoder.
func (v *imageValidator) InjectDecoder(d *admission.Decoder) error {
	v.decoder = d
	return nil
}

PWD=$(shell pwd)
IMAGE_REPOSITORY?=deepfenceio
DF_IMG_TAG?=latest
IMAGE=$(IMAGE_REPOSITORY)/admission-webhook:$(DF_IMG_TAG)

all: clean build

.PHONY: build
build:
	CGO_ENABLED=0 go build -o webhook *.go

.PHONY: clean
clean:
	rm webhook

.PHONY: run
run: build
	$(PWD)/webhook

.PHONY: docker-image
docker-image:
	docker build -t $(IMAGE) $(PWD)

.PHONY: docker-push
docker-push: docker-image
	docker push $(IMAGE)

.PHONY: certs
certs:
	cd $(PWD)/manifests && bash certs.sh && cd - 

.PHONY: label-default-ns
label-ns:
	kubectl label ns default deepfence.io/admission-webhook=enabled

.PHONY: namespace
namespace:
	kubectl create ns deepfence

.PHONY: install
install:
	kubectl apply -f manifests/validating-webhook.yaml
	kubectl apply -n deepfence \
	-f manifests/webhook-tls.yaml \
	-f manifests/webhook-secret.yaml \
	-f manifests/webhook.yaml

.PHONY: uninstall
uninstall:
	kubectl delete -f manifests/validating-webhook.yaml
	kubectl delete -n deepfence \
	-f manifests/webhook.yaml \
	-f manifests/webhook-tls.yaml \
	-f manifests/webhook-secret.yaml

.PHONY: kind-load
kind-load: docker-image
	kind load docker-image $(IMAGE)
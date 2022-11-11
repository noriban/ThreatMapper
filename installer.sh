#!/bin/bash
set -e

DEFAULT_PLATFORM="docker"
DEFAULT_VERSION="v1.4.1"
DEFAULT_STORAGE_CLASS="\"\""
supported_versions=("v1.2.0" "v1.3.0" "v1.3.1" "v1.4.0" "v1.4.1" "v1.4.1-update")

RED="\033[1;31m"
GREEN="\033[1;32m"
NOCOLOR="\033[0m"
CYAN="\033[1;36m"

PLATFORM=$DEFAULT_PLATFORM
VERSION=$DEFAULT_VERSION
STORAGE_CLASS=$DEFAULT_STORAGE_CLASS

# Echo usage if something isn't right.
usage() { 
    printf "Usage: $0 [-p <docker|kubernetes> : default: $DEFAULT_PLATFORM] [-v <string> : default: $DEFAULT_VERSION]" 1>&2; exit 1; 
}

unsupported_version() {
    printf "${RED}unsupported version: $1${NOCOLOR}\n" 1>&2; exit 1; 
}

unsupported_platform() {
    printf "${RED}unsupported platform: $1${NOCOLOR}\n" 1>&2; exit 1;
}

check_k8s_readiness() {
    echo "check if kubectl is present"
    echo "check if helm is present"
    echo "check if k8s is ready"
}

setup_metrics_server() {
    echo "check if metric server is installed"
}

detailed_setup() {
    helm repo add deepfence https://deepfence-helm-charts.s3.amazonaws.com/threatmapper

    # create values file
    helm show values deepfence/deepfence-console > deepfence_console_values.yaml

    # expression=".image.tag = "${VERSION}""
    # yq -i "${expression}" deepfence_console_values.yaml
    sed -i.bak -e "/^\([[:space:]]*tag: \).*/s//\1${VERSION}/" deepfence_console_values.yaml
    # storageClass: openebs-hostpath
    sed -i.bak -e "/^\([[:space:]]*storageClass: \).*/s//\1${STORAGE_CLASS}/" deepfence_console_values.yaml

    # check for underlying runtime
    CONTAINER_RUNTIME_OUT=$(kubectl get nodes -o jsonpath='{.items[*].status.nodeInfo.containerRuntimeVersion}' | grep "containerd" 2>&1) || { echo "containerd not detected."; }
    if [[ (! -z "$CONTAINER_RUNTIME_OUT") ]]; then
        echo "containerd detected."
        RUNTIME="containerd"
    fi

    CONTAINER_RUNTIME_OUT=$(kubectl get nodes -o jsonpath='{.items[*].status.nodeInfo.containerRuntimeVersion}' | grep "docker" 2>&1) || { echo "docker not detected."; }
    if [[ (! -z "$CONTAINER_RUNTIME_OUT") ]]; then
        echo "docker"
        RUNTIME="docker"
    fi

    if [ "$RUNTIME" = "docker" ]; then
        sed -i.bak -e "/^\([[:space:]]*dockerSock:: \).*/s//\1true/" deepfence_console_values.yaml
        sed -i.bak -e "/^\([[:space:]]*containerdSock:: \).*/s//\1false/" deepfence_console_values.yaml
    elif [ "$RUNTIME" = "containerd" ]; then
        sed -i.bak -e "/^\([[:space:]]*containerdSock: \).*/s//\1true/" deepfence_console_values.yaml
        sed -i.bak -e "/^\([[:space:]]*dockerSock: \).*/s//\1false/" deepfence_console_values.yaml
    fi
}

while getopts "p:v:s:" o; do
    case "${o}" in
        p)
            PLATFORM=${OPTARG}
            [[ $PLATFORM != "docker" && $PLATFORM != "kubernetes" ]] && unsupported_platform "$PLATFORM"
            ;;
        v)  
            VERSION=${OPTARG}
            [[ ! " ${supported_versions[*]} " =~ " ${VERSION} " ]] && unsupported_version "$VERSION"
            ;;
        s)  
            STORAGE_CLASS=${OPTARG}
            ;;
        \?)
            printf "${RED}ERROR: Invalid option -$OPTARG${NOCOLOR}\n"
            usage
            ;;
    esac
done
shift $((OPTIND-1))

if_docker_compose_exists() {
    # docker compose version
    if ! [ -x "$(command -v docker compose)" ];
    then
        printf "${RED}Docker compose not installed!${NOCOLOR}\n"
        exit 1
    fi
}

do_install() {
    if [ "$PLATFORM" = "docker" ];
    then
        # Check if docker compose exists
        if_docker_compose_exists
        printf "${CYAN}Installing Deepfence ThreatMapper $VERSION in $PLATFORM${NOCOLOR}\n"
        wget -q -O docker-compose.yml "https://raw.githubusercontent.com/deepfence/ThreatMapper/$VERSION/deployment-scripts/docker-compose.yml"
        docker compose up -d

    elif [ "$PLATFORM" = "kubernetes" ];
    then
        printf "${CYAN}Installing Deepfence ThreatMapper in Kubernetes${NOCOLOR}\n"
        # check if k8s nodes are ready
        # check_k8s_readiness
        # setup_metrics_server

        # kubectl create ns openebs
        # helm install openebs --namespace openebs --repo "https://openebs.github.io/charts" openebs --set analytics.enabled=false
        # Wait for pods to start up

        detailed_setup

        helm install -f deepfence_console_values.yaml deepfence-console deepfence/deepfence-console --namespace default
    else
        printf "${RED}Unsupported platform! $PLATFORM${NOCOLOR}\n"

    fi
}

do_install
# curl -fsSL get.deepfence.io/install/threatmapper | bash -
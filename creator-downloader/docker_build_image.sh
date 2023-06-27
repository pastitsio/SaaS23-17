#!/bin/bash
# Check two args are provided
if [ $# -lt 2 ]; then
  echo "Error: Missing mandatory argument."
  echo "Usage: ./docker_build_container.sh <port> <SimplePlot|ScatterPlot|BarLabelPlot|Downloader>"
  exit 1
fi

# Check if arg1=port is one of the allowed values
case "$1" in
    6011|6012|6013|6020)
        ;; 
    *)
        echo "<port> must be one of 6011|6012|6013|6020."
        exit 1
        ;;
esac

# Check if arg2=run_type is one of the allowed values
case "$2" in
    "SimplePlot"|"ScatterPlot"|"BarLabelPlot"|"Downloader")
        ;;
    *)
        echo "<${2}> is invalid."
        echo "Please provide one of the following values:"
        echo "  SimplePlot|ScatterPlot|BarLabelPlot|Downloader"
        exit 1
        ;;
esac

# Run
eval "saas_KEYCLOAK_CLIENT_ID=\${saas_KEYCLOAK_${2}_CLIENT_ID}"
eval "saas_KEYCLOAK_CLIENT_SECRET_KEY=\${saas_KEYCLOAK_${2}_CLIENT_SECRET_KEY}"
eval "saas_APP_PORT=\${saas_APP_${2}_PORT}"

eval "IMAGE_NAME=\$(echo "${2}" | tr '[:upper:]' '[:lower:]')"

docker build \
    --build-arg "APP_PORT=${saas_APP_PORT}" \
    --build-arg "APP_RUN_TYPE=${2}" \
    --build-arg "AZURE_CONN_STR=${saas_AZURE_CONN_STR}" \
    --build-arg "AZURE_CREDENTIAL=${saas_AZURE_CREDENTIAL}" \
    --build-arg "AZURE_CONTAINER_NAME=${saas_AZURE_CONTAINER_NAME}" \
    --build-arg "KAFKA_HOST=${saas_KAFKA_HOST}" \
    --build-arg "KAFKA_PORT=${saas_KAFKA_PORT}" \
    --build-arg "KEYCLOAK_HOST=${saas_KEYCLOAK_HOST}" \
    --build-arg "KEYCLOAK_PORT=${saas_KEYCLOAK_PORT}" \
    --build-arg "KEYCLOAK_REALM_NAME=${saas_KEYCLOAK_REALM_NAME}" \
    --build-arg "KEYCLOAK_CLIENT_ID=${saas_KEYCLOAK_CLIENT_ID}" \
    --build-arg "KEYCLOAK_CLIENT_SECRET_KEY=${saas_KEYCLOAK_CLIENT_SECRET_KEY}" \
    -t "saas-ntua/${IMAGE_NAME}-image" .
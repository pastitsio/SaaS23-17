#!/bin/bash
# Check two args are provided
if [ $# -lt 1 ]; then
  echo "Error: Missing mandatory argument."
  echo "Usage: ./run_container.sh <SimplePlot|ScatterPlot|BarLabelPlot|Downloader>"
  exit 1
fi

# Check if arg1=run_type is one of the allowed values
case "$1" in
    "SimplePlot"|"ScatterPlot"|"BarLabelPlot"|"Downloader")
        ;;
    *)
        echo "<${1}> is invalid."
        echo "Please provide one of the following values:"
        echo "  SimplePlot|ScatterPlot|BarLabelPlot|Downloader"
        exit 1
        ;;
esac
eval "saas_APP_PORT=\${saas_APP_${1}_PORT}"
eval "IMAGE_NAME=\$(echo "${1}" | tr '[:upper:]' '[:lower:]')"

docker run \
    -p ${saas_APP_PORT}:${saas_APP_PORT} \
    --network="host" \
    --name "saas-ntua_${IMAGE_NAME}_container" \
    saas-ntua/${IMAGE_NAME}-image

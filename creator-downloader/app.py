"""
Server app creation with custom Plot object,
Azure Container for storing created images, 
kafka producer for db sync
and distinction between plot types.
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""
import argparse

from azure.azure_container_client import AzureContainerClient
from config_setup import config
from create_app import create_app
from download_app import download_app
from kafka_setup.kafka_producer import KafkaProducer
from kafka_setup.kafka_event import chart_data_kafka_event, credit_data_event
from keycloak import KeycloakOpenID
from plot import BarLabelPlot, ScatterPlot, SimplePlot
from utils import check_run_plot_type


def main():
    ################################
    # Parse command line arguments #
    ################################
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-t",
        "--type",
        type=lambda x: check_run_plot_type(x, config['RUN']['TYPES']),
        help="Type of plotting app.",
        required=True,
    )
    parser.add_argument("-p", "--port",
                        help="TCP port to run on.",
                        required=True)

    args = parser.parse_args()
    #############################
    # Setup runtime environment #
    #############################

    run_type = args.type
    if run_type == 'BarLabelPlot':
        plot = BarLabelPlot
    elif run_type == 'ScatterPlot':
        plot = ScatterPlot
    elif run_type == 'SimplePlot':
        plot = SimplePlot
    elif run_type == 'Downloader': 
        pass

    ##########################################
    # Setup Azure storage for created images #
    ##########################################
    az_config = config["AZURE"]
    azure_container_client = AzureContainerClient(
        conn_str=az_config['CONN_STR'],
        container_name=az_config['CONTAINER_NAME'],
        credential=az_config['CREDENTIAL'],
    )

    #########################
    # Setup Kafka producers #
    #########################
    kafka_config = config['KAFKA']
    chart_data_producer = KafkaProducer(
        kafka_event=chart_data_kafka_event,
        bootstrap_servers=f"{kafka_config['HOST']}:{kafka_config['PORT']}",
    )
    credit_data_producer = KafkaProducer(
        kafka_event=credit_data_event,
        bootstrap_servers=f"{kafka_config['HOST']}:{kafka_config['PORT']}",
    )

    ###########################
    # Setup Keycloak for auth #
    ###########################
    kc_config = config['KEYCLOAK']
    keycloak_client = KeycloakOpenID(
        server_url=f"{kc_config['HOST']}:{kc_config['PORT']}",
        realm_name=kc_config['REALM_NAME'],
        client_id=kc_config[run_type]['CLIENT_ID'],
        client_secret_key=kc_config[run_type]['CLIENT_SECRET_KEY']
    )

    #####################
    # Create app and run#
    #####################
    if run_type == 'Downloader':
        app = download_app(keycloak_client=keycloak_client,
                           azure_container_client=azure_container_client)
    else: 
        app = create_app(plot=plot,
                         keycloak_client=keycloak_client,
                         azure_container_client=azure_container_client,
                         chart_data_producer=chart_data_producer,
                         credit_data_producer=credit_data_producer
                         )

    port = args.port
    app.run(debug=True, port=port)


if __name__ == "__main__":
    main()

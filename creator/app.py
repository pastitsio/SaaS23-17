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
from kafka_setup.kafka_producer import KafkaProducer
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
        type=lambda x: check_run_plot_type(x, config['PLOT']['TYPES']),
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

    plot_type = args.type
    if plot_type == 'BarLabelPlot':
        plot = BarLabelPlot
    elif plot_type == 'ScatterPlot':
        plot = ScatterPlot
    elif plot_type == 'SimplePlot':
        plot = SimplePlot

    ##########################################
    # Setup Azure storage for created images #
    ##########################################
    az_config = config["AZURE"]
    azure_container_client = AzureContainerClient(
        conn_str=az_config['CONN_STR'],
        container_name=az_config['CONTAINER_NAME'],
        credential=az_config['CREDENTIAL'],
    )

    ########################
    # Setup Kafka producer #
    ########################
    kafka_config = config['KAFKA']
    kafka_producer = KafkaProducer(
        topic=kafka_config['TOPIC'],
        bootstrap_servers=f"{kafka_config['HOST']}:{kafka_config['PORT']}",
    )

    ###########################
    # Setup Keycloak for auth #
    ###########################
    kc_config = config['KEYCLOAK']
    keycloak_client = KeycloakOpenID(
        server_url=kc_config['SERVER_URL'],
        realm_name=kc_config['REALM_NAME'],
        client_id=kc_config[plot_type]['CLIENT_ID'],
        client_secret_key=kc_config[plot_type]['CLIENT_SECRET_KEY']
    )

    #####################
    # Create app and run#
    #####################
    app = create_app(
        plot=plot,
        keycloak_client=keycloak_client,
        azure_container_client=azure_container_client,
        kafka_producer=kafka_producer
    )

    port = args.port
    app.run(debug=True, port=port)


if __name__ == "__main__":
    main()

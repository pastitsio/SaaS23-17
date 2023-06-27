"""
Server app creation with custom Plot object,
Azure Container for storing created images, 
kafka producer for db sync
and distinction between plot types.
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""

from azure.azure_container_client import AzureContainerClient
from config_setup import config
from create_app import create_app
from download_app import download_app
from kafka_setup.kafka_producer import KafkaProducer
from kafka_setup.kafka_event import kafka_event
from keycloak import KeycloakOpenID
from plot import BarLabelPlot, ScatterPlot, SimplePlot


def main():
    print(config.items(), sep='\n')
    ##########################################
    # Setup Azure storage for created images #
    ##########################################
    azure_container_client = AzureContainerClient(
        conn_str=config["azure_conn_str"],
        container_name=config["azure_container_name"],
        credential=config["azure_credential"],
    )

    ########################
    # Setup Kafka producer #
    ########################
    kafka_producer = KafkaProducer(
        kafka_event,
        bootstrap_servers=f'{config["kafka_host"]}:{config["kafka_port"]}',
    )

    ###########################
    # Setup Keycloak for auth #
    ###########################
    keycloak_client = KeycloakOpenID(
        server_url=f'{config["keycloak_host"]}:{config["keycloak_port"]}',
        realm_name=config["keycloak_realm_name"],
        client_id=config["keycloak_client_id"],
        client_secret_key=config["keycloak_client_secret_key"]
    )

    #############################
    # Setup runtime environment #
    #############################
    
    run_type = config["app_run_type"]
    if run_type == 'BarLabelPlot':
        plot = BarLabelPlot
    elif run_type == 'ScatterPlot':
        plot = ScatterPlot
    elif run_type == 'SimplePlot':
        plot = SimplePlot
    elif run_type == 'Downloader':
        pass

    #####################
    # Create app and run#
    #####################
    if run_type == 'Downloader':
        app = download_app(keycloak_client=keycloak_client,
                           azure_container_client=azure_container_client,
                           )
    else:
        app = create_app(plot=plot,
                         keycloak_client=keycloak_client,
                         azure_container_client=azure_container_client,
                         kafka_producer=kafka_producer,
                         )

    port = config["app_port"]
    app.run(debug=True, port=port)


if __name__ == "__main__":
    main()

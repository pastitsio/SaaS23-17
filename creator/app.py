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
from kafka_setup.kafka_event import chart_data_kafka_event, credit_data_kafka_event
from keycloak import KeycloakOpenID
from plot import BarLabelPlot, ScatterPlot, SimplePlot


def main():
    #########################
    # Setup Kafka producers #
    #########################
    chart_data_producer = KafkaProducer(
        kafka_event=chart_data_kafka_event,
        bootstrap_servers=f"{config['kafka_host']}:{config['kafka_port']}",
    )
    credit_data_producer = KafkaProducer(
        kafka_event=credit_data_kafka_event,
        bootstrap_servers=f"{config['kafka_host']}:{config['kafka_port']}",
    )

    ##########################################
    # Setup Azure storage for created images #
    ##########################################
    azure_container_client = AzureContainerClient(
        conn_str=config["azure_conn_str"],
        container_name=config["azure_container_name"]
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

    ##############################
    # Create runtime environment #
    ##############################
    
    run_type = config["app_container_name"]
    if run_type == 'downloader':
        app = download_app(keycloak_client=keycloak_client,
                           azure_container_client=azure_container_client,
                           )
    else:
        if run_type == 'bar-label-plot':
            plot = BarLabelPlot
        elif run_type == 'scatter-plot':
            plot = ScatterPlot
        elif run_type == 'simple-plot':
            plot = SimplePlot

        app = create_app(plot=plot,
                         keycloak_client=keycloak_client,
                         azure_container_client=azure_container_client,
                         chart_data_producer=chart_data_producer,
                         credit_data_producer=credit_data_producer
                         )
                         
    ###########
    # Run app #
    ###########
    print(config, flush=True)
    app.run(host=config["app_container_name"],
            debug=True,
            port=config["app_port"])


if __name__ == "__main__":
    main()

"""
Server app creation with custom Plot object,
Azure Container for storing created images
and distinction between plot
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""
import argparse

from keycloak import KeycloakOpenID

from azure.azure_container_client import AzureContainerClient
from config_loader import config
from create_app import create_app
from plot import BarLabelPlot, ScatterPlot, SimplePlot
from utils import app_user


def main(): # pylint: disable=C0116
    ################################
    # Parse command line arguments #
    ################################
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-u",
        "--user",
        type=(lambda x: app_user(x, config["PLOT"]["TYPES"])),
        help="Type of app.",
        required=True,
    )
    parser.add_argument("-p", "--port",
                        help="TCP port to run on.",
                        required=True)

    args = parser.parse_args()

    #############################
    # Setup runtime environment #
    #############################
    user = args.user.upper()
    if user == "BAR_LABEL_PLOT":
        PLOT = BarLabelPlot
    if user == "SCATTER_PLOT":
        PLOT = ScatterPlot
    if user == "SIMPLE_PLOT":
        PLOT = SimplePlot

    ###########################
    # Setup Keycloak for auth #
    ###########################
    kc_server_url = config['KEYCLOAK']["SERVER_URL"]
    kc_realm_name = config['KEYCLOAK']["REALM_NAME"]
    kc_client_id = config['KEYCLOAK'][user]["CLIENT_ID"]
    kc_secret_key = config['KEYCLOAK'][user]["CLIENT_SECRET_KEY"]
    kc_client = KeycloakOpenID(
        server_url=kc_server_url,
        realm_name=kc_realm_name,
        client_id=kc_client_id,
        client_secret_key=kc_secret_key
    )

    ##########################################
    # Setup Azure storage for created images #
    ##########################################
    key = config["AZURE"]["KEY"]
    connection_string = config["AZURE"]["CONNECTION_STRING"]
    container_name = config["AZURE"]["CONTAINER_NAME"]
    container_client = AzureContainerClient(
        conn_str=connection_string,
        container_name=container_name,
        credential=key,
    )

    app = create_app(
        user=user,
        plot=PLOT,
        kc_client=kc_client,
        container_client= container_client
        )

    port = args.port
    app.run(debug=True, port=port)


if __name__ == "__main__":
    main()

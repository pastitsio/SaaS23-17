from azure.azure_container_client import AzureContainerClient
from config_setup import config
from download_app import download_app
from keycloak import KeycloakOpenID


def main():
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
    if run_type != 'downloader':
        raise ValueError('env var `app_containe_name` must be `downloader`')

    app = download_app(keycloak_client=keycloak_client,
                       azure_container_client=azure_container_client,
                       )
    ###########
    # Run app #
    ###########
    app.run(host=config["app_container_name"],
            debug=True,
            port=config["app_port"])


if __name__ == "__main__":
    main()

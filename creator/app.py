"""
Server app creation with custom Plot object,
Azure Container for storing created images
and distinction between plot
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""
import argparse
import json

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from keycloak import KeycloakOpenID

from auth import kc_introspect_token
from azure.azure_container_client import AzureContainerClient
from config_loader import config
from plot import BarLabelPlot, ScatterPlot, SimplePlot, Plot
from utils import (app_user,
                   check_file,
                   generate_uuid,
                   preflight_OPTIONS_method)


def create_app(runner: str, plot: Plot, client: AzureContainerClient) -> Flask:
    """Creates app using runtime-resolved configuration.

    Args:
        user (str): plot type
        plot (Plot): plot_type class
        client (AzureContainerClient): azure container client

    Raises:
        ValueError: Create route mode shoudl either be 'preview' or 'save'

    Returns:
        Flask: Flask app instance
    """
    _app = Flask("create_app")
    CORS(_app)

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

    # [OPTIONS handling, file existence] checks before each request.
    # Note: CORS-preflight never includes credentials.
    _app.before_request(preflight_OPTIONS_method)
    _app.before_request(check_file)

    @_app.route("/create", methods=["POST", "OPTIONS"])
    def create():
        try:
            user_id = kc_introspect_token(kc_client=kc_client).get('sub')

            file = json.load(request.files["file"])
            _plot = plot(file)
            _plot.validate()

            mode = request.args.get("mode")
            if mode == "preview":
                # always create previews in JPEG format
                image = _plot.create_chart(img_format="jpeg")["jpeg"]
                return Response(image, mimetype="image/jpeg"), 200

            if mode == "save":
                images = _plot.create_chart(img_format="all")
                img_id = generate_uuid(distinct=runner)
                for img_format, img_data in images.items():
                    blob_filepath = f'{user_id}/{img_id}/{img_format}' # construct filepath
                    client.upload_to_blob(data=img_data, blob_filepath=blob_filepath)

                # !TODO: kafkify changes
                return "Success", 200

            raise ValueError("Mode should either be SAVE or PREVIEW.")

        except Exception as exc: # pylint: disable=broad-except
            return jsonify({"message": exc}), 500

    return _app


if __name__ == "__main__":
    valid_runners = config["PLOT"]["TYPES"]

    ################################
    # Parse command line arguments #
    ################################
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-u",
        "--user",
        type=(lambda x: app_user(x, valid_runners)),
        help="Type of app.",
        required=True,
    )
    parser.add_argument("-p", "--port", help="TCP port to run on.", 
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

    app = create_app(user, PLOT, container_client)
    port = args.port
    app.run(debug=True, port=port)

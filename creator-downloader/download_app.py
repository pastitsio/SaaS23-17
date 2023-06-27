import json

from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from keycloak import KeycloakOpenID

from azure.azure_container_client import AzureContainerClient
from keycloak_auth.keycloak import kc_introspect_token
# from kafka_setup.kafka_producer import KafkaProducer
from utils import preflight_OPTIONS_method


def download_app(keycloak_client: KeycloakOpenID,
                 azure_container_client: AzureContainerClient
                 ) -> Flask:
    """Download app using runtime-resolved configuration.

    Raises:
        ValueError: Create route mode should either be 'preview' or 'save'

    Returns:
        Flask: Flask app instance
    """
    app = Flask("download_app")
    CORS(app)

    # [OPTIONS handling] check before each request.
    # Note: CORS-preflight never includes credentials.
    app.before_request(preflight_OPTIONS_method)

    @app.route("/download/<string:user_email>/<string:blob_filepath>", methods=["GET", "OPTIONS"])
    def download(user_email, blob_filepath):
        try:
            token_email = kc_introspect_token(
                kc_client=keycloak_client).get('email')

            img_format = request.args.get('format')

            if token_email != user_email:
                return 'Not authorized for this resource!', 401

            # preview is jpeg
            url = f'{user_email}/{blob_filepath}/{img_format}'
            image = azure_container_client.read_from_blob(url)

            return Response(image, mimetype=f'image/{img_format}'), 200

        except Exception as exc:
            print(exc)
            return jsonify({"msg": str(exc)}), 500

    return app

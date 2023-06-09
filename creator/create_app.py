import json

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from keycloak import KeycloakOpenID

from auth import kc_introspect_token
from azure.azure_container_client import AzureContainerClient
from kafka_producer import KafkaProducer
from plot import Plot
from utils import (check_file,
                   generate_uuid,
                   preflight_OPTIONS_method)


def create_app(plot: Plot,
               keycloak_client: KeycloakOpenID,
               azure_container_client: AzureContainerClient,
               kafka_producer: KafkaProducer
               ) -> Flask:
    """Creates app using runtime-resolved configuration.

    Args:
        user (str): plot type
        plot (Plot): plot_type class
        client (AzureContainerClient): azure container client

    Raises:
        ValueError: Create route mode should either be 'preview' or 'save'

    Returns:
        Flask: Flask app instance
    """
    app = Flask("create_app")
    CORS(app)

    # [OPTIONS handling, file existence] checks before each request.
    # Note: CORS-preflight never includes credentials.
    app.before_request(preflight_OPTIONS_method)
    app.before_request(check_file)

    @app.route("/create", methods=["POST", "OPTIONS"])
    def create():
        try:
            user_email = kc_introspect_token(kc_client=keycloak_client).get('email')

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
                img_id = generate_uuid(distinct=user_email) # user_id to mess with randomly-created uuid's seed.
                blob_path = f'{user_email}/{img_id}'
                for img_format, img_data in images.items():
                    # construct filepath with user, img and format info.
                    blob_file = f'{blob_path}/{img_format}'
                    azure_container_client.upload_to_blob(
                        data=img_data, blob_filepath=blob_file
                    )


                # message is sent with acks set to 1, meaning the sender waits 
                # so that is read by at least 1 broker.
                kafka_producer.send(
                    value={'imgUrl': blob_path, 'chartType': plot.__name__}
                )

                return "Success", 200
            raise ValueError("Mode should either be SAVE or PREVIEW.")

        except Exception as exc:
            return jsonify({"message": str(exc)}), 500

    return app

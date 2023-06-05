import json

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from keycloak import KeycloakOpenID

from auth import kc_introspect_token
from azure.azure_container_client import AzureContainerClient
from plot import Plot
from utils import (check_file,
                   generate_uuid,
                   preflight_OPTIONS_method)


def create_app(user: str,
               plot: Plot,
               kc_client: KeycloakOpenID,
               container_client: AzureContainerClient) -> Flask:
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
    app = Flask("create_app")
    CORS(app)


    # [OPTIONS handling, file existence] checks before each request.
    # Note: CORS-preflight never includes credentials.
    app.before_request(preflight_OPTIONS_method)
    app.before_request(check_file)

    @app.route("/create", methods=["POST", "OPTIONS"])
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
                img_id = generate_uuid(distinct=user)
                for img_format, img_data in images.items():
                    blob_filepath = f'{user_id}/{img_id}/{img_format}' # construct filepath
                    container_client.upload_to_blob(data=img_data, blob_filepath=blob_filepath)

                # !TODO: kafkify changes
                return "Success", 200
            raise ValueError("Mode should either be SAVE or PREVIEW.")

        except Exception as exc: # pylint: disable=broad-except
            return jsonify({"message": str(exc)}), 500

    return app

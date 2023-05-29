"""
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""
import argparse
import json

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from auth import require_token_validation
from config_loader import config
from Plot import *
from utils import check_file_exists, preflight_options, validate_user

# application factory function
def create_app(user):
    app = Flask("create_app")
    # use CORS
    CORS(app)
    # [Token validation, OPTIONS handling, file existence] checks before each request
    app.before_request(preflight_options)
    app.before_request(lambda: require_token_validation(user))
    app.before_request(check_file_exists)

    @app.route("/create/", methods=["POST", "OPTIONS"])
    def create():
        # check available formats
        img_format = request.args.get("format", default="jpeg")
        valid_formats = config["PLOT"]["FORMATS"]
        if img_format not in valid_formats:
            return (
                jsonify(
                    {
                        "message": f"Unsupported output format {img_format}. Expected {valid_formats}."
                    }
                ),
                415,
            )

        try:
            file = request.files["file"]
            file = json.load(file)

            _plot = PLOT(file)
            _plot.validate()

            img_stream = _plot.create_chart(img_format)

            # !TODO: store to database and kafkify
            return Response(img_stream, mimetype=f"image/{img_format}"), 200
        except Exception as e:
            return jsonify({"message": e}), 500

    return app

if __name__ == "__main__":
    # Create an argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-u", "--user", type=validate_user, help=f"Type of app.", required=True
    )
    parser.add_argument("-p", "--port", help=f"TCP port to run on.", required=True)

    # Parse the command-line arguments
    args = parser.parse_args()

    user = args.user.upper()  # which plot type, for runtime
    if user == "BAR_LABEL_PLOT":
        PLOT = BarLabelPlot
    if user == "SCATTER_PLOT":
        PLOT = ScatterPlot
    if user == "SIMPLE_PLOT":
        PLOT = SimplePlot

    app = create_app(user)

    port = args.port
    app.run(debug=True, port=port)

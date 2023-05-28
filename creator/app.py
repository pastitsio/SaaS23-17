"""
Both validation and creation are done in this file,
because they both utilize the custom Plot class.
Distinction is done cmd args.
"""
import argparse
import json

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from config import config
from Plot import Plot
from utils import before_request

validate_app = Flask("validate_app")
CORS(validate_app)

create_app = Flask("create_app")
CORS(create_app)

# Token validation, File existence check before each request
validate_app.before_request(before_request)


@validate_app.route("/validate/", methods=["POST", "OPTIONS"])
def validate():
    try:
        file = request.files["file"]
        file = json.load(file)

        Plot(json_input=file).validate()

        return "Success", 200

    except Exception as e:
        return str(e), 415


# Token validation, File existence check before each request
create_app.before_request(before_request)


@create_app.route("/create/", methods=["POST", "OPTIONS"])
def create():
    # check available formats
    format = request.args.get("format", default="jpeg")
    if format not in config["PLOT"]["FORMATS"]:
        return jsonify({"message": f"Unsupported output format {format}."}), 415

    # try:
    file = request.files["file"]
    file = json.load(file)

    # check if file is validated to skip process
    validated = request.args.get("validated", default=True)
    img_stream = Plot(file, validated).create_chart(format)

    # !TODO: store to database and kafkify
    return Response(img_stream, mimetype=f"image/{format}"), 200
    # except:
    #     return jsonify({"message": "Cannot create image."}), 500


if __name__ == "__main__":
    PLOT_TYPES = config["PLOT"]["TYPES"].split(",")

    def validate_who(value):
        valid_values = ["validator"] + PLOT_TYPES
        if value not in valid_values:
            raise argparse.ArgumentTypeError(
                f'Invalid value for "who". Allowed values are: {", ".join(valid_values)}'
            )
        return value

    # Create an argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-w", "--who", type=validate_who, help=f"Type of app.", required=True
    )
    parser.add_argument("-p", "--port", help=f"TCP port to run on.", required=True)
    # Parse the command-line arguments
    args = parser.parse_args()

    who = args.who
    port = args.port

    if who == "validator":
        app = validate_app
    else:
        app = create_app

    # if who == "bar_label_plot":
    #     PLOT = BarLabelPlot
    # if who == "scatter_plot":
    #     PLOT = ScatterPlot
    # if who == "simple_plot":
    #     PLOT = SimplePlot

    app.run(debug=True, port=port)

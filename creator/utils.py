"""Various utilities"""
from collections import namedtuple
from datetime import datetime

from flask import jsonify, request
from shortuuid import uuid

from config_loader import config

fields = ("is_type", "ndim", "optional")
defaults = (None, 0, False)
Label = namedtuple("label", fields, defaults=defaults)


def check_file():
    """Check request file exists and is json"""
    file = request.files.get("file")
    if not file:
        return jsonify({"message": "No file uploaded. Expected JSON."}), 400

    if file.content_type != "application/json":
        return jsonify({"message": "Unsupported file format. Expected JSON."}), 415


def preflight_OPTIONS_method():
    """OPTIONS method is preflight, meaning it is sent by the browser
    to check CORS functionality before the actual req. Interceptor cannot interfere with it.
    """
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers["Access-Control-Allow-Origin"] = config["FRONTEND"][
            "SERVER_URL"
        ]
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        return response


def generate_uuid(distinct=None):
    """Generate random uuid, with datetime.now().timestamp as seed."""
    return uuid(name=f'{distinct}{str(round(datetime.now().timestamp() * 1000))}')


def check_run_plot_type(value, valid_values):
    """Check if user is valid."""
    if value not in valid_values:
        raise ValueError(
            f'Invalid value for "type". Allowed values are: {", ".join(valid_values)}'
        )
    return value


def type2str(type_name):
    """Extract human-readable type name."""
    try:
        label_type = type_name._name
    except AttributeError:
        label_type = str(type_name).split(" ")[1][1:-2]

    return label_type

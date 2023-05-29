from collections import namedtuple

from flask import jsonify, request

from config_loader import config

fields = ("is_type", "ndim")
defaults = (None, 0)
label = namedtuple("label", fields, defaults=defaults)


def check_file_exists():
    # check file is json
    file = request.files["file"]
    if file.content_type != "application/json":
        return jsonify({"message": "Unsupported file format. Expected JSON."}), 415


def preflight_options():
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


def validate_user(value):
    """Check if user is valid."""
    PLOT_TYPES = config["PLOT"]["TYPES"].split(",")
    valid_values = ["validator"] + PLOT_TYPES
    if value not in valid_values:
        raise ValueError(
            f'Invalid value for "user". Allowed values are: {", ".join(valid_values)}'
        )
    return value


def type2str(type_name):
    """Extract human-readable type name.
    """
    try:
        label_type = type_name._name
    except AttributeError:
        label_type = str(type_name).split(" ")[1][1:-2]

    return label_type
from collections import namedtuple
from flask import jsonify, request

from auth import invalidate_token
from config import config

fields = ("is_type", "ndim")
defaults = (None, 0)
label = namedtuple("label", fields, defaults=defaults)


def _type_name(type_name):
    try:
        label_type = type_name._name
    except AttributeError:
        label_type = str(type_name).split(" ")[1][1:-2]

    return label_type


def before_request():
    # OPTIONS method is preflight, meaning it is sent by the browser
    # to check CORS functionality. Interceptor cannot interfere with it.
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers["Access-Control-Allow-Origin"] = config["FRONTEND"][
            "SERVER_URL"
        ]
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        return response

    token = request.headers.get("Authorization")
    token = token.split()[1]  # remove 'Bearer' word

    if not invalidate_token(token):
        return jsonify({"message": "Invalid Token"}), 401

    # check file is in request
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400

    # check file is json
    file = request.files["file"]
    if file.content_type != "application/json":
        return jsonify({"message": "Unsupported file format. Expected JSON."}), 415

def snake_to_camel(snake_case_string):
    components = snake_case_string.split('_')
    return ''.join(x.title() for x in components)
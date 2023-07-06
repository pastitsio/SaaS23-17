"""Various utilities"""
import os

from datetime import datetime

from flask import jsonify, request
from shortuuid import uuid


def check_file():
    """Check request file exists and is json"""
    file = request.files.get("file")
    if not file:
        return jsonify({"message": "No file uploaded. Expected CSV."}), 400

    if file.content_type != "text/csv":
        return jsonify({"message": "Unsupported file format. Expected CSV."}), 415


def preflight_OPTIONS_method():
    """OPTIONS method is preflight, meaning it is sent by the browser
    to check CORS functionality before the actual req. Interceptor cannot interfere with it.
    """
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        return response


def generate_uuid(distinct=None):
    """Generate random uuid, with datetime.now().timestamp as seed."""
    return uuid(name=f'{distinct}{str(round(datetime.now().timestamp() * 1000))}')


def configuration_obj_to_dict(value):
    """
    Converts Configuration object to Python dict
    """
    if isinstance(value, str):
        return os.environ.get(value[1:], '') if value.startswith('$') else value.replace('$', '')
    elif isinstance(value, dict):
        for key, val in value.items():
            value[key] = configuration_obj_to_dict(val)
    elif isinstance(value, list):
        for i, val in enumerate(value):
            value[i] = configuration_obj_to_dict(val)

    return value

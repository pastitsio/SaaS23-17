"""Various utilities"""
import os

from flask import jsonify, request


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


def configuration_obj_to_dict(value):
    """
    Converts Configuration object to Python dict
    IMPORTANT NOTE: Environment variables should start with '$' symbol
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

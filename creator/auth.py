import requests

from flask import jsonify, request

from config_loader import config

config = config["KEYCLOAK"]

keycloak_server_url = config["SERVER_URL"]
keycloak_realm = config["REALM"]


def require_token_validation(user):
    """
    Check with keycloak that request is valid within realm premises.
    """
    token = request.headers.get("Authorization")
    token = token.split()[1]  # remove 'Bearer' word

    introspection_endpoint = f"{keycloak_server_url}/realms/{keycloak_realm}/protocol/openid-connect/token/introspect"

    data = {
        "token": token,
        "client_id": config[user]["CLIENT_ID"],
        "client_secret": config[user]["CLIENT_SECRET"],
    }

    response = requests.post(introspection_endpoint, data=data)

    if response.status_code == 200:
        introspection_result = response.json()
        if introspection_result.get("active"):
            print("Token is valid.")
            return  # is valid, continue execution
        else:
            print("Token is not valid.")
            return jsonify({"message": "Invalid Token"}), 401
    else:
        print("Failed to introspect token.")
        return jsonify({"message": "Failed to introspect token."}), 401

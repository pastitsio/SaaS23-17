"""Module providing token validation function for keycloak.

Returns:
    request.response: response 
"""
import keycloak

from flask import request

def _get_token_from_request():
    """GET JWT TOKEN"""
    token = request.headers.get("Authorization")
    token = token.split()[1]  # remove 'Bearer' word
    return token

def kc_introspect_token(kc_client):
    """Checks if token is valid within realm premises.

    Args:
        kc_client (keycloak.KeycloakOpenID): keycloak connection client

    Raises:
        keycloak.exceptions.KeycloakInvalidTokenError: Token inactive

    Returns:
        Dict: decoded token
    """
    token = _get_token_from_request()
    introspection_result = kc_client.introspect(token)

    if not introspection_result.get("active"):
        raise keycloak.exceptions.KeycloakInvalidTokenError('Invalid Token')
    if not ('user' in introspection_result.get('realm_access').get('roles')):
        raise keycloak.exceptions.KeycloakInvalidTokenError('"user" role not assigned')

    return introspection_result

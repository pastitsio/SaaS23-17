import requests

from config import config

keycloak_server_url = config['Keycloak']['SERVER_URL']
keycloak_realm = config['Keycloak']['REALM']
keycloak_client_id = config['Keycloak']['CLIENT_ID']
keycloak_client_secret = config['Keycloak']['CLIENT_SECRET']

def invalidate_token(token):
    '''
    Check with keycloak that request is valid 
    within realm premises.
    '''
    introspection_endpoint = f'{keycloak_server_url}/realms/{keycloak_realm}/protocol/openid-connect/token/introspect'

    data = {
        'token': token,
        'client_id': keycloak_client_id,
        'client_secret': keycloak_client_secret,
    }

    response = requests.post(introspection_endpoint, data=data)

    if response.status_code == 200:
        introspection_result = response.json()
        if introspection_result.get('active'):
            print('Token is valid.')
            return True
        else:
            print('Token is not valid.')
            return False
    else:
        print('Failed to introspect token.')
        return False

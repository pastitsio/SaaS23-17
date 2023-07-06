import os

# ------------------------------------------------
#  Paths
# ------------------------------------------------
CREATOR_APP_PACKAGE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CONFIGURATION_DIR = os.path.join(CREATOR_APP_PACKAGE, 'config')
ENVIRONMENT_CONF_FILEPATH = os.path.join(DEFAULT_CONFIGURATION_DIR, 'environment.yaml')
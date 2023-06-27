"""Loads configuration files.

Returns:
    Dict: config dict
"""
import confuse

from settings import ENVIRONMENT_CONF_FILEPATH
from utils import configuration_obj_to_dict
# Load YAML default configurations
configuration_obj = confuse.Configuration('creator-downloader', __name__)
configuration_obj.set_file(ENVIRONMENT_CONF_FILEPATH)

# Convert Configuration object to Python dict
config = configuration_obj_to_dict(configuration_obj.get())
"""Loads configuration files.

Returns:
    Dict: config dict
"""
import yaml

from settings import DEFAULT_CONF_FILEPATH, ENVIRONMENT_CONF_FILEPATH

def load_config(filepath):
    """Loads configuration file from filepath.

    Args:
        filepath (str): conf file path

    Returns:
        Dict: dict of loaded config.
    """
    with open(filepath, "r", encoding='utf-8') as file:
        config_data = yaml.safe_load(file)
    return config_data

# Load configurations from the YAML file
config = load_config(DEFAULT_CONF_FILEPATH) | load_config(ENVIRONMENT_CONF_FILEPATH)

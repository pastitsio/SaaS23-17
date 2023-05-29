import yaml

def load_config(file_path):
    with open(file_path, "r") as file:
        config_data = yaml.safe_load(file)
    return config_data

# Load the configuration from the YAML file
config = load_config("config.yaml")
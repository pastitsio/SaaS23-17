from config_loader import config
from Database import Database

config = config["MONGO"]

username = config["USERNAME"]
password = config["PASSWORD"]
clustername = config["CLUSTERNAME"]
db_name = config["DB_NAME"]

uri = f"""mongodb+srv://{username}:{password}@{clustername}.mongodb.net/?retryWrites=true&w=majority"""
db = Database(uri, db_name)

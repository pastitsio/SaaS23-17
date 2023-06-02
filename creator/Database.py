import time

from threading import Thread
from typing import Dict

from pymongo.errors import PyMongoError
from pymongo.mongo_client import MongoClient


class Database:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.client = MongoClient(connection_string)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

        # DB health check
        try:
            self.client.admin.command("ping")
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            raise e

    def save_images(self, images: Dict[str, bytes], max_retries: int = 3) -> Dict[str, str]:
        """Stores the images to db in all possible formats. 
        
        Args:
            images (Dict[str, bytes]): Dict with keys being the format_name and values the images in bytes.

        Returns:
            Insertion id.
        """
              
        for _ in range(max_retries):
            try:                        
                result = self.collection.insert_one(images)
                if result.acknowledged:
                    break
            except PyMongoError as e:
                print(f"Error occurred during insertion: {e}")
                time.sleep(.02)
                continue
                
            raise Exception("Failed to store image after maximum retries")
                
        return result.inserted_id
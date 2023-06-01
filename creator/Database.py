import time

from threading import Thread
from typing import Dict

from pymongo.errors import PyMongoError
from pymongo.mongo_client import MongoClient


class MyThread(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.exc = None

    def run(self):
        try:
            super().run()
        except Exception as e:
            self.exc = e


class Database:
    def __init__(self, connection_string: str, db_name: str):
        self.client = MongoClient(connection_string)
        self.db = self.client[db_name]

        # DB health check
        try:
            self.client.admin.command("ping")
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            raise e

    def save_images(self, images: Dict[str, bytes]) -> Dict[str, str]:
        """Stores the images to db in all possible formats. 
        
        !! Multithreaded for each collection-img_format.

        Args:
            images (Dict[str, bytes]): Dict with keys being the format_name and values the images in bytes.

        Returns:
            Dict[str, str]: Dict with keys being the format_name and values the db id's from storing process.
        """

        def _store_image(collection_name, image_data, max_retries=3):
            collection = self.db[collection_name]
            
            for _ in range(max_retries):
                try:
                    result = collection.insert_one({'data': image_data})
                    if result.acknowledged:
                        return result.inserted_id
                except PyMongoError as e:
                    print(f"Error occurred during insertion: {e}")
                    time.sleep(.02)Γ
                    continue
            
            raise Exception("Failed to store image after maximum retries")
                
        # Create a dictionary to store the inserted _id values
        result_ids = {}

        # Create a thread for each collection and start them
        threads = []
        for collection_name, image_data in images.items():
            thread = MyThread(
                target=lambda: result_ids.update(
                    {collection_name: _store_image(collection_name, image_data)}
                )
            )
            threads.append(thread)
            thread.start()

        # Wait for all threads to finish
        for thread in threads:
            thread.join()
            if thread.exc:
                # Exception occurred in the thread, handle it here
                raise thread.exc

        # Print the result ids
        for collection_name, result_id in result_ids.items():
            print(f"Image stored in collection: {collection_name}, _id: {result_id}")

        return result_ids

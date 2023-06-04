from datetime import datetime
from io import BytesIO
from typing import Dict

from azure.storage.blob import BlobType, ContainerClient


class AzureContainerClient:
    """
    AzureContainerClient connects to an Azure blob Container.
    """
    def __init__(self, conn_str, container_name, credential):
        # account_url = f'https://{account_name}.blob.core.windows.net'
        self.container_client = ContainerClient.from_connection_string(
            conn_str=conn_str,
            container_name=container_name,
            credential=credential,
            )

    def list_blobs(self, name_starts_with=None):
        """
        Returns a generator to list the blobs under the specified container.
        :param name_starts_with:
            Filters the results to return only blobs whose names begin with the specified prefix.
        :type name_starts_with: str
        :return: list generator
        """
        return self.container_client.list_blobs(name_starts_with)

    def read_from_blob(self, blob_name: str) -> BytesIO:
        """
        Get contents from Azure blob storage.
        """

        # Download blob as StorageStreamDownloader object (stored in memory)
        downloaded_blob = self.container_client.download_blob(blob_name)
        blob_bytes = BytesIO(downloaded_blob.content_as_bytes())
        return blob_bytes


    def upload_to_blob(self, data: BytesIO, blob_filepath:str, overwrite=True):
        """
        Uploads image in Azure container.
        """
        blob_type = BlobType.BlockBlob # no append
        blob_client = self.container_client.get_blob_client(blob_filepath)

        # Upload content to the Page Blob
        blob_client.upload_blob(data, blob_type=blob_type, overwrite=overwrite)


    def delete_blob(self, blob_name):
        """Deletes blob"""
        blobs = list(self.list_blobs(name_starts_with=blob_name))
        if len(blobs) > 1:
            raise Exception( # pylint: disable=W0719
                f"""More than one blobs found in container with  \
                name starting with {blobs}. 'Delete_blob aims at \
                deleting only one blob, if this blob exists.""")
               
        self.container_client.delete_blobs(*blobs)

    def delete_blobs(self, blob_names):
        """Deletes list of blobs"""
        for blob_name in blob_names:
            self.delete_blob(blob_name)

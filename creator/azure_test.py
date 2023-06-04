import io
import os
import shortuuid

from azure.azure_container_client import AzureContainerClient
from config_loader import config
from creator.plot import SimplePlot

# try:


# Define your storage account and shared key credentials
conn_str = config['AZURE']['CONNECTION_STRING']
account_key = config['AZURE']['KEY']

# Create the BlobServiceClient object
container_client = AzureContainerClient(
    conn_str=conn_str, 
    container_name='images',
    credential=account_key
)

# with open('../mock-server-download/presets/preset1.json', 'r') as f:
#   data = json.load(f)

# user_id = 'kostas'

# plot = SimplePlot(data)
# plot.validate()
# img_format = 'jpeg'

# img = plot.create_chart(img_format)[img_format]
# img_id = shortuuid.uuid()

# upload_path = os.path.join(user_id, img_format, img_id)
# print(upload_path)

img = container_client.read_from_blob('kostas/jpeg/Dq83gsTqTvcZ2rgHP5Ysau')
img = io.BytesIO(img)
img = plt.imread(img)

                 

# print(container_client.read_from_blob('tqa.yml'))


# except:
#     print('Error connecting on Azure Blob Storage.')
''' ! Must be run from 'creator' dir level'''
import io

from avro.io import BinaryDecoder, DatumReader
from kafka import KafkaConsumer
from kafka_setup.kafka_event import kafka_event

consumer = KafkaConsumer(
    'chart-data',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda x: x,
    auto_offset_reset="earliest",
    enable_auto_commit=False
)


reader = DatumReader(kafka_event)

def process_message(message):
    bytes_reader = io.BytesIO(message.value)
    decoder = BinaryDecoder(bytes_reader)
    data = reader.read(decoder)
    print(data)


for message in consumer:
    process_message(message)

import os

from avro import schema

schema_filepath = os.path.join(os.path.dirname(__file__), 'kafka_event_schema.json')

with open(schema_filepath, 'r') as f:
    event = schema.parse(f.read())

kafka_event = event

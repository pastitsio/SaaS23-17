import os

from avro import schema

chart_data_schema_filepath = os.path.join(os.path.dirname(__file__), 'chart_data_event_schema.json')
credit_data_schema_filepath = os.path.join(os.path.dirname(__file__), 'credit_data_event_schema.json')

with open(chart_data_schema_filepath, 'r') as f:
    chart_data_event = schema.parse(f.read())
with open(credit_data_schema_filepath, 'r') as f:
    credit_data_event = schema.parse(f.read())

chart_data_kafka_event = chart_data_event
credit_data_kafka_event = credit_data_event

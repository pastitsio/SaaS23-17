import io
import json
from typing import Dict

import avro.io as avro_io
from avro import schema
from kafka import KafkaProducer as _KafkaProducer

_MSG_VALID_KEYS = {'chart-data': ['email',
                                  'chart_name',
                                  'chart_type',
                                  'chart_url',
                                  'created_on'],
                   'credit-data': ['email',
                                   'credits']
                   }


class KafkaProducer(_KafkaProducer):
    """KafkaProdcuer with extra func for 
    serializer and key-checker for messages.
    See super class for config.
    """

    def __init__(self, kafka_event: schema, encoding: str = 'avro', **configs):

        if encoding == 'avro':
            def _serializer(v):
                writer = avro_io.DatumWriter(kafka_event)
                bytes_writer = io.BytesIO()
                writer.write(v, avro_io.BinaryEncoder(bytes_writer))
                return bytes_writer.getvalue()

        elif encoding == 'json':
            def _serializer(v): return json.dumps(v).encode('utf-8')

        super().__init__(value_serializer=_serializer,
                         acks=1,
                         **configs
                         )

    @property
    def topic(self):
        return self._topic

    # override
    def send(self, topic: str, value: Dict):
        valid_keys = _MSG_VALID_KEYS[topic]
        assert all(key in valid_keys
                   for key in value.keys()), 'Missing key.'
        super().send(topic=topic, value=value)  

import io
import json
from typing import Dict

import avro.io as avro_io
from kafka import KafkaProducer as _KafkaProducer

from kafka_setup.kafka_event import kafka_event


class KafkaProducer(_KafkaProducer):
    """KafkaProdcuer with fixed topic.
    See super class for config.
    """

    def __init__(self, topic, encoding='avro', **configs):

        self._topic = topic
        
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
    def send(self, value: Dict, **kwargs):
        assert all(key in ['imgUrl', 'chartType']
                   for key in value.keys()), 'Missing key.'
        super().send(topic=self._topic, value=value, **kwargs)

import json
from typing import Dict

from kafka import KafkaProducer as KP


class KafkaProducer(KP):
    """KafkaProdcuer with fixed topic.
    See super class for config.
    """

    def __init__(self, topic, **configs):
        super().__init__(value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                         acks=1,
                         **configs
                         )
        self._topic = topic

    @property
    def topic(self):
        return self._topic

    # override
    def send(self, value: Dict, **kwargs):
        assert all(key in ['imgUrl', 'chartType']
                   for key in value.keys()), 'Missing key.'
        super().send(topic=self._topic, value=value, **kwargs)

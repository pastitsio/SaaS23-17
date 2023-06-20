''' ! Must be run from 'creator' dir level'''
from kafka_setup.kafka_producer import KafkaProducer


producer = KafkaProducer(
    topic='chart-data',
    bootstrap_servers='localhost:9092'
)

producer.send(
    value={"email": "Dom@DeCoco.com",
           "imgUrl": "DominiqueDeCoco/adsfghjkl12345",
           "chartType": "SimplePlot"}
)

producer.close()  # much needed for accumulator

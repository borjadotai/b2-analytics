const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'server',
  brokers: ['localhost:9092'],
})

const clientIds = ['123', '456', '789'];

async function sendMessage(clientId) {
    const producer = kafka.producer();
    await producer.send({
        topic: clientId,
        messages: [
          { value: 'view' },
        ],
      })
}

clientIds.map(clientId => {
  for (let i; i < 10; i++ ) {
    sendMessage(clientId);
  }
})
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'server',
  brokers: ['localhost:9092'],
})

async function sendMessage(clientId) {
    const producer = kafka.producer();
    await producer.send({
        topic: clientId,
        messages: [
          { value: 'view' },
        ],
      })
}

for (let i = 0; i < 10; i++) {
  sendMessage('test-topic');
}
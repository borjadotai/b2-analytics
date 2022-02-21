const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'server',
  brokers: ['localhost:9092'],
})

class Counter {
  constructor() {
    this._counter = {};
  }

  increment(page) {
    if (this._counter[page] == undefined) {
      this._counter[page] = 1
    } else {
      this._counter[page]++;
    }
  }

  getViews(page) {
    return this._counter[page] || 0;
  }

  display() {
    console.log("\n")
    Object.entries(this._counter).forEach(
      ([pageName, viewCount]) => console.log(`${pageName} got ${viewCount} views`)
    );
    console.log("\n")
  }
}

class Client {

    constructor(id) {
        this.id = id;
        this.counter = new Counter();
    }

    async setUp() {
        this._producer = kafka.producer()
        this._consumer = kafka.consumer({ groupId: this.id })

        await this._producer.connect()
        await this._consumer.connect()
    }

    async tearDown() {
        this._producer?.disconnect();
        this._consumer?.disconnect();
      }

    async setupSubscription() {
        await this._consumer.subscribe({ topic: this.id, fromBeginning: true })
        await this._consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.counter.increment(message.value.toString());
                this.counter.display();
            },
        })
    }

}

async function main() {
    let client = new Client('test-topic');
    try {
        client.setUp();
        client.setupSubscription();
    } catch(e) {
        client.tearDown();
        console.log(e);
    }
};

main()
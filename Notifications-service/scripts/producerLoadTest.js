const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "load-test-producer",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function run() {
    await producer.connect();

    const totalEvents = 10000;

    console.time("Kafka Publish");

    for (let i = 0; i < totalEvents; i++) {
        await producer.send({
            topic: "game.events",
            messages: [
                {
                    value: JSON.stringify({
                        eventType: "GAME_FETCHED",
                        gameId: i,
                        timestamp: Date.now(),
                    }),
                },
            ],
        });
    }

    console.timeEnd("Kafka Publish");

    await producer.disconnect();
}

run().catch(console.error);
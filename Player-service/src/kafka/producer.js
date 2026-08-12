const { Kafka } = require("kafkajs");
const { GAME_EVENTS } = require("./topic");

const kafka = new Kafka({
    clientId: "player-service",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
    console.log("Kafka Producer Connected");
}

async function publishGameEvent(payload) {
    await producer.send({
        topic: GAME_EVENTS,
        messages: [
            {
                value: JSON.stringify(payload),
            },
        ],
    });

    console.log("Event Published");
}

module.exports = {
    connectProducer,
    publishGameEvent,
};
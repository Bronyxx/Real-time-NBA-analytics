const { Kafka } = require("kafkajs");
const {createNotification}= require("../services/notificationService.js")
let processed = 0;
const startTime = Date.now();
const kafka = new Kafka({
    clientId: "notification-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
    groupId: "notification-group",
});

async function startConsumer() {
    await consumer.connect();
    console.log(" Consumer Connected");

    await consumer.subscribe({
        topic: "game.events",
        fromBeginning: true,
    });

    console.log(" Consumer Subscribed");

    await consumer.run({
        eachMessage: async ({ message }) => {
            
            const event = JSON.parse(message.value.toString())
            console.log(event);

             await createNotification({
                title:"Game_Notification",
                message:`${event.eventType} recieved`,
                eventType: event.eventType,
                referenceId: event.gameId?.toString() ?? null,
             });


             processed++;

if (processed % 1000 === 0) {
    const elapsed = (Date.now() - startTime) / 1000;

    console.log("-------------------------");
    console.log(`Processed: ${processed}`);
    console.log(`Elapsed: ${elapsed.toFixed(2)} sec`);
    console.log(`Rate: ${(processed / elapsed).toFixed(2)} events/sec`);
    console.log("-------------------------");
}
        },
    });
}

module.exports = { startConsumer };
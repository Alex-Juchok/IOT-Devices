"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// plugins/kafka/index.ts
const kafkajs_1 = require("kafkajs");
const topic = "test-topic";
const KafkaPlugin = {
    name: "KafkaPlugin",
    async load(app) {
        const kafka = new kafkajs_1.Kafka({
            clientId: "my-node-app",
            brokers: ["localhost:9092"],
        });
        // Init producer
        const producer = kafka.producer();
        await producer.connect();
        // REST endpoint to send messages
        app.server.post("/kafka/send", async (req, res) => {
            const { message } = req.body;
            if (!message)
                return res.status(400).send("Missing message");
            await producer.send({
                topic,
                messages: [{ value: message }],
            });
            res.send("Message sent to Kafka");
        });
        // Init consumer
        const consumer = kafka.consumer({ groupId: "my-group" });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ message }) => {
                console.log("📨 Received from Kafka:", message.value?.toString());
            },
        });
        // Save references if needed later for unload()
        KafkaPlugin._producer = producer;
        KafkaPlugin._consumer = consumer;
        console.log("✅ KafkaPlugin loaded");
    },
    async unload() {
        const producer = KafkaPlugin._producer;
        const consumer = KafkaPlugin._consumer;
        if (consumer)
            await consumer.disconnect();
        if (producer)
            await producer.disconnect();
        console.log("🔌 KafkaPlugin unloaded");
    },
};
exports.default = KafkaPlugin;

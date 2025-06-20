import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: ["localhost:9092"],
});

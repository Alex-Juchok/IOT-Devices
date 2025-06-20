import { kafka } from "./kafkaClient";
import { emitKafkaMessage } from "../socket";


const consumer = kafka.consumer({ groupId: "my-group" });

export const startConsumer = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();
      console.log(`Kafka message: ${value}`);
      if (value) {
        emitKafkaMessage(value);
      }
    },
  });
};
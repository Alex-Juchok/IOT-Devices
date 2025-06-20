import { kafka } from "./kafkaClient";

const producer = kafka.producer();

export const sendMessage = async (topic: string, message: string) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  await producer.disconnect();
};

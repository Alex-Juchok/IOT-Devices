// plugins/kafka/index.ts
import { Kafka, Producer, Consumer } from "kafkajs";
import { Plugin } from "../../../core/types";
import { App } from "../../../core/App";
import { Request, Response } from "express";

const topic = "test-topic";

interface AlarmEvent {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  severity: string;
  messages: string;
  parameters: {
    currentTemperature: number;
    threshold: number;
    unit: string;
  };
  acknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  correlationId: string;
}

const KafkaPlugin: Plugin = {
  name: "KafkaPlugin",

  async load(app: App) {
    const db = (app as any).db;
        const io = (app as any).io;

    const kafka = new Kafka({
      clientId: "my-node-app",
      brokers: ["localhost:9092"],
    });

    const producer: Producer = kafka.producer();
    await producer.connect();

    app.server.post("/kafka/send", async (req: any, res: any) => {
      const event: AlarmEvent = req.body;

      if (!event || !event.id || !event.timestamp || !event.type) {
        return res.status(400).json({ message: "Invalid event format" });
      }

      try {
        await producer.send({
          topic,
          messages: [{ value: JSON.stringify(event) }],
        });

        res.status(200).json({ message: "Event sent to Kafka" });
      } catch (error) {
        console.error("❌ Kafka send error:", error);
        res.status(500).json({ message: "Failed to send event" });
      }
    });

    const consumer: Consumer = kafka.consumer({ groupId: "my-group" });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          
          const event: AlarmEvent = JSON.parse(message.value?.toString() || "{}");
          console.log("📨 Received from Kafka:", event);

          const deviceId = event.source.split(":")[1]; // e.g., 'thermostat-01'

          // Найти device.id по имени
          const deviceResult = await db.query("SELECT id FROM devices WHERE name = $1", [deviceId]);
          console.log(deviceResult);

          if (deviceResult.rowCount === 0) {
            console.warn(`⚠️ Device '${deviceId}' not found in DB`);
            return;
          }

          const deviceUUID = deviceResult.rows[0].id;

          // Найти соответствующие типы события и severity
          const [eventType, severity] = await Promise.all([
            db.query("SELECT id FROM event_types WHERE name = $1", [event.type]),
            db.query("SELECT id FROM events_severitys WHERE name = $1", [event.severity]),
          ]);

          if (eventType.rowCount === 0 || severity.rowCount === 0) {
            console.warn("⚠️ Event type or severity not found in DB");
            return;
          }

          // Сохранить событие
          await db.query(
            `INSERT INTO events (device_id, event_type, severity_id, message, parameters)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              deviceUUID,
              eventType.rows[0].id,
              severity.rows[0].id,
              event.messages,
              event.parameters,
            ]
          );

          // Найти пользователей, у которых есть доступ к устройству
          const usersResult = await db.query(
            `SELECT u.id, u.username
             FROM user_device_permissions udp
             JOIN users u ON u.id = udp.user_id
             WHERE udp.device_id = $1`,
            [deviceUUID]
          );


          for (const user of usersResult.rows) {
            console.log(`📤 Событие отправлено пользователю ${user.id}`);
            io.to(user.id).emit("device-event", event);
          }

        } catch (e) {
          console.error("❌ Failed to process Kafka message:", e);
        }
      },
    });

    (KafkaPlugin as any)._producer = producer;
    (KafkaPlugin as any)._consumer = consumer;

    console.log("✅ KafkaPlugin loaded");
  },

  async unload() {
    const producer: Producer | undefined = (KafkaPlugin as any)._producer;
    const consumer: Consumer | undefined = (KafkaPlugin as any)._consumer;

    if (consumer) await consumer.disconnect();
    if (producer) await producer.disconnect();

    console.log("🔌 KafkaPlugin unloaded");
  },
};

export default KafkaPlugin;

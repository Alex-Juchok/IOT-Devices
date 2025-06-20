// import express from "express";
// import { createServer } from "http";
// import { sendMessage } from "./kafka/producer";
// import { startConsumer } from "./kafka/consumer";
// import { initSocket } from "./socket";

// const app = express();
// app.use(express.json());

// const httpServer = createServer(app);
// initSocket(httpServer); // ← Подключаем Socket.IO

// // POST endpoint для отправки сообщений в Kafka
// app.post("/send", async (req, res) => {
//   const { topic, message } = req.body;
//   try {
//     await sendMessage(topic, message);
//     res.send("Message sent to Kafka!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Failed to send message");
//   }
// });

// // Запускаем консюмера
// startConsumer("test-topic").catch(console.error);

// // Запуск сервера
// const PORT = 3000;
// httpServer.listen(PORT, () => {
//   console.log(`HTTP + WebSocket server running on http://localhost:${PORT}`);
// });

// import { App } from "./core/App";
// import { userPlugin } from "./plugins/userPlugin";

// const app = new App();

// app.usePlugin(userPlugin);

// app.start(3000);


// const express = require('express');
// const Plugins = require('./plugins');

// class App {
//   constructor() {
//     super();

//     this.plugins = new Plugins(this);

//     this.server = express();
//     this.server.use(express.json());
//   }

//   async start() {
//     await this.plugins.load();

//     this.server.get('/', (req, res) => {
//       res.send('Hello World!');
//     });

//     this.server.listen(8080, () => {
//       console.log('Server started on port 3000')
//     });
//   }

//   stop() {
//     if (this.stopped) return;
//     console.log('Server stopped');
//     this.stopped = true;
//     process.exit();
//   }
// }

// const app = new App();
// app.start();

// ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"].forEach(event => {
//   process.on(event, () => app.stop());
// });

// src/index.ts
import { App } from "./core/App";


const app = new App();

app.start(5731);

["SIGINT", "SIGTERM", "exit", "uncaughtException"].forEach((signal) => {
  process.on(signal, () => app.stop());
});

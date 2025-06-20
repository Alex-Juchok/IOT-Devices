// import { Server } from "socket.io";
// import { Server as HttpServer } from "http";

// let io: Server;

// export const initSocket = (server: HttpServer) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*", // Для тестов, можно указать конкретный origin
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };

// export const emitKafkaMessage = (message: string) => {
//   if (io) {
//     io.emit("kafka-message", message);
//   }
// };

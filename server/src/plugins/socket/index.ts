import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Plugin } from "../../core/types";
import { App } from "../../core/App";

interface UserSocket {
  userId: string;
  socket: Socket;
}

const SocketIOPlugin: Plugin = {
  name: "SocketIOPlugin",

  async load(app: App) {
    const httpServer = app.server.listen(8081); // Можно использовать один и тот же порт, если интегрировать напрямую
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const userSockets = new Map<string, Socket[]>();
    (app as any).io = io;
    (app as any).userSockets = userSockets;

    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;

      if (userId) {
        socket.join(userId);
        console.log(`🔌 Пользователь ${userId} подключен и добавлен в комнату`);
      } else {
        socket.disconnect();
        console.warn("⚠️ Подключение без userId было отклонено");
      }

      if (!userSockets.has(userId)) {
        userSockets.set(userId, []);
      }

      userSockets.get(userId)?.push(socket);

      console.log(`🔌 User connected: ${userId}`);

      socket.on("disconnect", () => {
        const sockets = userSockets.get(userId) || [];
        userSockets.set(
          userId,
          sockets.filter((s) => s.id !== socket.id)
        );

        if (userSockets.get(userId)?.length === 0) {
          userSockets.delete(userId);
        }

        console.log(`❌ User disconnected: ${userId}`);
      });
    });

    console.log("✅ SocketIOPlugin loaded");
  },

  async unload() {
    console.log("🔌 SocketIOPlugin unloaded");
  },
};

export default SocketIOPlugin;

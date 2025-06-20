// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket = null;

export function connectSocket(userId) {
  if (!socket) {
    socket = io("http://localhost:8081", {
      query: { userId },
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  return socket;
}

export function getSocket() {
  return socket;
}

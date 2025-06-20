// src/core/App.ts
import express, { Application } from "express";
import cors from 'cors';


import { PluginManager } from "./PluginManager";

export class App {
  public readonly server:Application;
  public readonly pluginManager = new PluginManager(this);
  private stopped = false;

  constructor() {
    this.server = express();

    this.server.use(cors({
      origin: 'http://localhost:3000', // Укажите точный URL вашего фронтенда
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // Разрешить передачу куков
    }))
    this.server.use(express.json());
  }

  async start(port = 8080): Promise<void> {
    await this.pluginManager.loadFromConfig();

    this.server.get("/", (_req, res) => {
      res.send("Hello World!");
    });

    this.server.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  }

  stop(): void {
    if (this.stopped) return;
    this.pluginManager.stop();
    this.stopped = true;
    console.log("🛑 Server stopped");
    process.exit(0);
  }
}


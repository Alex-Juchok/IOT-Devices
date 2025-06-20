// import { Plugin } from "./types";
// import express from "express";

// export class PluginManager {
//   private plugins: Plugin[] = [];

//   async registerPlugins(app: express.Application) {
//     for (const plugin of this.plugins) {
//       console.log(`Registering plugin: ${plugin.name}`);
//       await plugin.register(app);
//     }
//   }

//   use(plugin: Plugin) {
//     this.plugins.push(plugin);
//   }
// }

// src/core/PluginManager.ts
import fs from "fs";
import path from "path";
import { Plugin } from "./types";
import { App } from "./App";

interface PluginConfig {
  [name: string]: {
    path: string;
    enabled: boolean;
  };
}

export class PluginManager {
  private app: App;
  private plugins: Record<string, Plugin> = {};

  constructor(app: App) {
    this.app = app;
  }

  async loadFromConfig(configPath = "./plugins.json"): Promise<void> {
    const raw = fs.readFileSync(configPath, "utf-8");
    const { plugins }: { plugins: PluginConfig } = JSON.parse(raw);

    for (const pluginName in plugins) {
      const { enabled, path: pluginPath } = plugins[pluginName];
      if (enabled) {
        await this.load(pluginName, pluginPath);
      }
    }
  }

  async load(name: string, modulePath: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(modulePath);
      const pluginModule: Plugin = require(resolvedPath).default;
      if (!pluginModule?.load) {
        throw new Error("Plugin must export a `load` function");
      }

      this.plugins[name] = pluginModule;
      await pluginModule.load(this.app);
      console.log(`✅ Loaded plugin: ${name}`);
    } catch (err) {
      console.error(`❌ Failed to load plugin '${name}':`, err);
      this.app.stop();
    }
  }

  unload(name: string): void {
    const plugin = this.plugins[name];
    if (plugin && typeof plugin.unload === "function") {
      plugin.unload();
      delete this.plugins[name];
      console.log(`🔌 Unloaded plugin: ${name}`);
    }
  }

  stop(): void {
    Object.keys(this.plugins).forEach((name) => this.unload(name));
  }
}

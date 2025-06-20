// src/core/types.ts
import { App } from "./App"

export interface Plugin {
    name: string;
    load(app: App): Promise<void> | void;
    unload?(): void;
  }
  
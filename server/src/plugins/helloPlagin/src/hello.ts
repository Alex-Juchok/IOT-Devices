import { Plugin } from "../../../core/types";
import { App } from "../../../core/App";

const HelloPlugin: Plugin = {
  name: "HelloPlugin",
  load(app: App) {
    app.server.get("/hello", (_req, res) => {
      res.send("👋 Hello from plugin!");
    });
  },
  unload() {
    console.log("🔌 HelloPlugin unloaded");
  },
};

export default HelloPlugin;

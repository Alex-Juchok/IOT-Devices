"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelloPlugin = {
    name: "HelloPlugin",
    load: function (app) {
        app.server.get("/hello", function (_req, res) {
            res.send("👋 Hello from plugin js!");
        });
    },
    unload: function () {
        console.log("🔌 HelloPlugin unloaded");
    },
};
exports.default = HelloPlugin;


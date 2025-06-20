// plugins/db/index.ts
import { Pool } from "pg";
import { Plugin } from "../../../core/types";
import { App } from "../../../core/App";


const DatabasePlugin: Plugin = {
  name: "DatabasePlugin",
  async load(app: App) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgres://postgres:sashamisha123@localhost:5432/IotDevices_db",
    });

    // Проверка подключения
    await pool.query("SELECT NOW()");

    // Добавим пул в приложение
    (app as any).db = pool;

    console.log("✅ Database connected");
  },

  async unload() {
    const db: Pool | undefined = ((DatabasePlugin as any)._app as any)?.db;
    if (db) await db.end();
    console.log("🔌 Database connection closed");
  },
};

export default DatabasePlugin;

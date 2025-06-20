import { Plugin } from "../../core/types";
import { App } from "../../core/App";
import { authenticateJWT, authorizeAccess } from "../../core/middleware/auth";
import bcrypt from "bcrypt";


const EventLogicPlugin: Plugin = {
  name: "EventLogicPlugin",

  async load(app: App) {
    const db = (app as any).db;

    // GET /devices/userdevices — получить все устройства пользователя
    app.server.get("/events/archiveEvents", authenticateJWT, async (req: any, res: any) => {
      const userId = req.user?.id;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token" });
      }

      try {
        const result = await db.query("SELECT * FROM get_events_by_date_range($1, $2, $3)", [userId, startDate, endDate]);
        res.json({ events: result.rows });
      } catch (err) {
        console.error("❌ Failed to fetch archive events:", err);
        res.status(500).json({ message: "Failed to fetch archive events" });
      }
    });

    app.server.get("/devices/deviceTypes", authenticateJWT, async (req: any, res: any) => {

      try {
        const result = await db.query("select * from devices_types");
        res.json({ device_types: result.rows });
      } catch (err) {
        console.error("❌ Failed to fetch device types:", err);
        res.status(500).json({ message: "Failed to fetch device types" });
      }
    });

    
  },

  async unload() {
    console.log("🔌 DeviceLogicPlugin unloaded");
  },
};

export default EventLogicPlugin;

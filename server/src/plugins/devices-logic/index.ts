import { Plugin } from "../../core/types";
import { App } from "../../core/App";
import { authenticateJWT, authorizeAccess } from "../../core/middleware/auth";
import bcrypt from "bcrypt";


const DevicesLogicPlugin: Plugin = {
  name: "DevicesLogicPlugin",

  async load(app: App) {
    const db = (app as any).db;

    // GET /devices/userdevices — получить все устройства пользователя
    app.server.get("/devices/userDevices", authenticateJWT, async (req: any, res: any) => {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token" });
      }

      try {
        const result = await db.query("SELECT * FROM get_user_devices($1)", [userId]);
        res.json({ devices: result.rows });
      } catch (err) {
        console.error("❌ Failed to fetch user devices:", err);
        res.status(500).json({ message: "Failed to fetch user devices" });
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

    app.server.get("/devices/deviceLocations", authenticateJWT, async (req: any, res: any) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        try {
            const result = await db.query("SELECT * FROM get_user_location_tree($1)", [userId]);
            const locations = result.rows;

            // Найдём максимальное значение depth
            const maxDepth = Math.max(...locations.map((loc: { depth: any; }) => loc.depth ?? 0));

            // Переворачиваем depth
            const inverted = locations.map((loc: { depth: number; }) => ({
            ...loc,
            depth: maxDepth - loc.depth
            }));

            res.json({ location: inverted });
        } catch (err) {
            console.error("❌ Failed to fetch user location:", err);
            res.status(500).json({ message: "Failed to fetch user location" });
        }
    });

    app.server.post("/devices/createLocation", authenticateJWT, async (req: any, res: any) => {
      const { locationName, description, parent_id = null } = req.body;
        try {
            const result = await db.query("select * from add_location($1, $2, $3)", [locationName, description, parent_id]);
            res.status(201).json({ location_id: result.rows[0].add_location });
        } catch (err) {
            console.error("❌ Failed to create device location:", err);
            res.status(500).json({ message: "Failed to create device location" });
        }
    });

    app.server.delete("/devices/delete-device", authenticateJWT, authorizeAccess("delete"), async (req: any, res: any) => {
      const { device_id } = req.body;
        try {
            const result = await db.query("select * from delete_device($1)", [device_id]);
            res.json({ message: result.rows });
        } catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.put("/devices/toggle-device", authenticateJWT, authorizeAccess("update"), async (req: any, res: any) => {
      const { device_id } = req.body;
        try {
            const result = await db.query("select * from toggle_device_status($1)", [device_id]);
            res.json({ device_status: result.rows[0].toggle_device_status });
        } catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.post("/devices/create-device", authenticateJWT, authorizeAccess("write"), async (req: any, res: any) => {
      const { user_id, device_name, device_type, location_id } = req.body;
        try {
            const result = await db.query("select * from add_device($1, $2, $3, $4, $5)", [user_id, 
              device_name, 
              device_type, 
              location_id, 
              'admin']);

            res.json({ device_id: result.rows[0] });
        } catch(err: any){
          if (err?.message) {
            console.log(err)
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.put("/devices/update-device", authenticateJWT, authorizeAccess("update"), async (req: any, res: any) => {
      const { device_id, device_name, device_type, location_id, status, user_permissions = [] } = req.body;
        try {
          const users = user_permissions?.map((user: any) => ({ user_id: user.user_id, permission_level: "admin" }));

          const result = await db.query("SELECT * from update_device($1, $2, $3, $4, $5, $6)", [device_id, 
            device_name, 
            device_type, 
            location_id, 
            status, 
            JSON.stringify(users) ]);

            res.json({ device: result.rows[0].update_device });
        } catch(err: any){
          if (err?.message) {
            console.log(err)
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

  },

  async unload() {
    console.log("🔌 DeviceLogicPlugin unloaded");
  },
};

export default DevicesLogicPlugin;

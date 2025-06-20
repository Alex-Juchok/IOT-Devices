import { Plugin } from "../../core/types";
import { App } from "../../core/App";
import { authenticateJWT, authorizeAccess } from "../../core/middleware/auth";
import bcrypt from "bcrypt";


const UserLogicPlugin: Plugin = {
  name: "UserLogicPlugin",

  async load(app: App) {
    const db = (app as any).db;

    // GET /user/devices — получить все устройства пользователя
    app.server.get("/user/devices", authenticateJWT, async (req: any, res: any) => {
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

    app.server.post("/user/create-user", authenticateJWT, authorizeAccess("admin"), async (req: any, res: any) => {
        const { creator_id, username, email, password, role } = req.body;

        try{
          const hash = await bcrypt.hash(password, 10);
          await db.query("select * from add_user($1, $2, $3, $4, $5)", [creator_id, username, email, hash, role]);

          res.status(201).json({ message: `User '${username}' with role '${role}' created` });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.put("/user/update-user", authenticateJWT, authorizeAccess("admin"), async (req: any, res: any) => {
        const { creator_id, user_id, username, email, password, role } = req.body;

        try{
          let hash = "";
          if (password != '') 
            hash = await bcrypt.hash(password, 10);
          await db.query("select * from update_user($1, $2, $3, $4, $5, $6)", [creator_id, user_id, username, email, hash, role]);

          res.status(200).json({ message: `User '${username}' with role '${role}' updated` });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.put("/user/update-user-data", authenticateJWT, async (req: any, res: any) => {
        const { user_id, username, email, password, role } = req.body;

        try{
          let hash = "";
          if (password != '') 
            hash = await bcrypt.hash(password, 10);
          await db.query("select * from update_user($1, $2, $3, $4, $5, $6)", [user_id, user_id, username, email, hash, role]);

          res.status(200).json({ message: `User '${username}' with role '${role}' updated` });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.delete("/user/delete-user", authenticateJWT, authorizeAccess("admin"), async (req: any, res: any) => {
        const { user_id, username } = req.body;

        try{
          await db.query("select * from delete_user($1)", [user_id]);

          res.status(200).json({ message: `User '${username}' deleted` });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

    app.server.get("/user/get-all-users/:id", authenticateJWT, authorizeAccess("admin"), async (req: any, res: any) => {
      const user_id = req.params.id;
        try{
          const result = await db.query("select * from get_all_users($1)", [user_id]);

          res.status(200).json({ users: result?.rows });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });

  app.server.get("/user/get-user-data/:id", authenticateJWT, authorizeAccess("write"), async (req: any, res: any) => {
      const user_id = req.params.id;
        try{
          const result = await db.query("select * from get_all_users($1)", [user_id]);

          res.status(200).json({ users: result?.rows });
        }
        catch(err: any){
          if (err?.message) {
            res.status(400).json({ error: err.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
    });
  },

  async unload() {
    console.log("🔌 UserLogicPlugin unloaded");
  },
};

export default UserLogicPlugin;

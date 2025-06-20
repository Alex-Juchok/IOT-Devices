import { Plugin } from "../../core/types";
import { App } from "../../core/App";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { Role } from "../../core/roles";
import { console } from "inspector";
import { authenticateJWT, authorizeAccess } from "../../core/middleware/auth";



const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const AuthPlugin: Plugin = {
  name: "AuthPlugin",

  async load(app: App) {
    const db = (app as any).db;


   

    app.server.post("/auth/login", async (req: any, res: any) => {
      const { email, password } = req.body;

      const result = await db.query(
        `SELECT u.id, u.username, u.email, u.password_hash, r.name AS role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.email = $1`, [email]);

      const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ 
          message: 'Неверный email или пароль!',
          success: false });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET, { expiresIn: "1h" });

      const userData = { ...user };
      delete userData.password_hash;

      res.json({ token,
        success: true,
        user: userData
       });
    });

    app.server.post("/auth/register", async (req: any, res: any) => {
      const { username, email, password } = req.body;

      const exists = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (exists.rowCount > 0) {
        return res.status(409).json({ 
          message: "Пользователь уже существует",
          success: false
         });
      }

      const guestRole = await db.query("SELECT id FROM roles WHERE name = 'guest'");
      if (guestRole.rowCount === 0) {
        return res.status(500).json({ 
        message: "Role 'guest' not found",
        success: false
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [username, email, hash, guestRole.rows[0].id]);

      const token = jwt.sign(
        { id: result.rows[0].id, username, email, role: "guest" },
        JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({ token,
        success: true,
        user: {
          id: result.rows[0].id, 
          username, 
          email, 
          role: "guest"
        }
       });
    });

    app.server.post("/auth/logout", (req: Request, res: Response) => {
      res.json({ message: "Выход выполнен успешно", success: true });
    });

    app.server.get("/auth/me", authenticateJWT, (req, res) => {
      res.json({ user: (req as any).user });
    });

    app.server.get("/admin-only", authenticateJWT, authorizeAccess("admin"), (_req, res) => {
      res.send("Welcome admin");
    });

    console.log("✅ AuthPlugin loaded");
  },

  async unload() {
    console.log("🔌 AuthPlugin unloaded");
  },
};

export default AuthPlugin;

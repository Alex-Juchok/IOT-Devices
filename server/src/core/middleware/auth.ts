// core/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../roles";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function authenticateJWT(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: Role.fromName(decoded.role)
    };
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function authorizeAccess(resource: string) {
  return (req: any, res: any, next: NextFunction) => {
    const role: Role = req.user?.role;
    if (!role || !role.canAccess(resource)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

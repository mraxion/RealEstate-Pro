import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    fullName: string;
  };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function requireSuperadmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Solo el superadministrador puede realizar esta acción" });
  }
  next();
}

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "@shared/schema";

// Genera un secreto seguro por defecto (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "Z3x!2p$7rQbL9wV5uK1aS6dF0hT8jY4c";
const JWT_EXPIRATION = "8h";

export function generateToken(user: Pick<User, "id" | "username" | "role" | "fullName">) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipos de usuario y roles
export type UserRole = "superadmin" | "admin" | "agent";
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextProps {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Por defecto, usuario superadmin simulado
  const [user, setUser] = useState<AuthUser | null>({
    id: 1,
    name: "Ana García",
    email: "ana.admin@portalinmo.com",
    role: "superadmin",
  });

  const login = (user: AuthUser) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

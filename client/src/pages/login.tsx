import React, { useState } from "react";
import { useAuth, AuthUser } from "@/context/auth-context";
import { useLocation } from "wouter";

const mockUsers: AuthUser[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.admin@portalinmo.com",
    role: "superadmin",
  },
  {
    id: 2,
    name: "Laura Martínez",
    email: "laura.martinez@gmail.com",
    role: "agent",
  },
  {
    id: 3,
    name: "Carlos Ruiz",
    email: "carlos.ruiz@empresa.com",
    role: "agent",
  },
];

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      login(user);
      navigate("/");
    } else {
      setError("Usuario no encontrado. Usa uno de los emails de ejemplo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-sm w-full responsive-form"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <label className="block mb-4">
          Email
          <input
            type="email"
            className="responsive-input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ana.admin@portalinmo.com"
            autoFocus
          />
        </label>
        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
        <button className="btn btn-primary w-full responsive-btn" type="submit">
          Entrar
        </button>
        <div className="mt-4 text-xs text-gray-500">
          <div>Usuarios de ejemplo:</div>
          <ul className="list-disc pl-4">
            <li>ana.admin@portalinmo.com (superadmin)</li>
            <li>laura.martinez@gmail.com (agent)</li>
            <li>carlos.ruiz@empresa.com (agent)</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default Login;

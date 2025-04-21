import React from "react";
import { useAuth } from "@/context/auth-context";

const Users = () => {
  const { user } = useAuth();

  if (!user || user.role !== "superadmin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Acceso denegado</h2>
          <p className="text-gray-600">Solo el superadministrador puede gestionar usuarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <div className="bg-white rounded shadow p-4">
        <table className="responsive-table">
          <thead>
            <tr>
              <th className="text-left">Nombre</th>
              <th className="text-left">Email</th>
              <th className="text-left">Rol</th>
              <th className="text-left">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana García</td>
              <td>ana.admin@portalinmo.com</td>
              <td>Superadministrador</td>
              <td>Activo</td>
              <td><button className="btn btn-xs btn-outline">Editar</button></td>
            </tr>
            <tr>
              <td>Laura Martínez</td>
              <td>laura.martinez@gmail.com</td>
              <td>Agente</td>
              <td>Activo</td>
              <td><button className="btn btn-xs btn-outline">Editar</button></td>
            </tr>
            <tr>
              <td>Carlos Ruiz</td>
              <td>carlos.ruiz@empresa.com</td>
              <td>Agente</td>
              <td>Activo</td>
              <td><button className="btn btn-xs btn-outline">Editar</button></td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary">Crear nuevo usuario</button>
        </div>
      </div>
    </div>
  );
};

export default Users;

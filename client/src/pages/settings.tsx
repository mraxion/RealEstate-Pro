import React from "react";

const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Configuración del Portal</h1>
      <div className="grid gap-6">
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-semibold text-lg mb-2">General</h2>
          <label className="block mb-2">
            Nombre del portal:
            <input type="text" className="input input-bordered w-full" placeholder="PortalInmo" />
          </label>
          <label className="block mb-2">
            Email de contacto:
            <input type="email" className="input input-bordered w-full" placeholder="info@portalinmo.com" />
          </label>
        </section>
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Apariencia</h2>
          <label className="block mb-2">
            Color principal:
            <input type="color" className="input input-bordered w-16 h-8" defaultValue="#0ea5e9" />
          </label>
          <label className="block mb-2">
            Logo:
            <input type="file" className="input input-bordered w-full" />
          </label>
        </section>
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Gestión de módulos</h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Propiedades
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Leads
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Citas
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Flujos de trabajo
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Análisis de mercado
            </label>
          </div>
        </section>
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Integraciones</h2>
          <label className="block mb-2">
            API Key Idealista:
            <input type="text" className="input input-bordered w-full" placeholder="Tu API Key" />
          </label>
          <label className="block mb-2">
            API Key Fotocasa:
            <input type="text" className="input input-bordered w-full" placeholder="Tu API Key" />
          </label>
        </section>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary w-full sm:w-auto">Guardar cambios</button>
      </div>
    </div>
  );
};

export default Settings;

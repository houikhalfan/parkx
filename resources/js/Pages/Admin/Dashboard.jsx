// resources/js/Pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function AdminDashboard() {
  const {
    users = [],
    pendingContractors = [],
    approvedContractors = [],
    csrf_token,
    url,
  } = usePage().props;

  // open the same two tabs you used before via ?tab=...
  const getTabFromUrl = () => {
    if (typeof window === "undefined") return "parkx";
    const qs = new URLSearchParams(window.location.search);
    return qs.get("tab") || "parkx";
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  useEffect(() => setActiveTab(getTabFromUrl()), [url]);

  return (
    <div>
      {/* --- Tabs header --- */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          href={route("admin.dashboard")}
          className={`px-3 py-1.5 rounded ${
            activeTab === "parkx" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Comptes ParkX
        </Link>
        <Link
          href={`${route("admin.dashboard")}?tab=contractors`}
          className={`px-3 py-1.5 rounded ${
            activeTab === "contractors" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Comptes contractants
        </Link>
      </div>

      {/* --- PARKX USERS TAB --- */}
      {activeTab === "parkx" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Créer un compte ParkX</h2>

          <form
            method="POST"
            action={route("admin.users.store")}
            className="space-y-4 bg-white p-6 rounded shadow max-w-md mb-8"
          >
            <input type="hidden" name="_token" value={csrf_token} />
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmer"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Créer l’utilisateur
            </button>
          </form>

          {/* Users table */}
          <h3 className="text-xl font-semibold mb-3">Tous les comptes ParkX</h3>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left uppercase text-gray-600">
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">VODs à rendre</th>
                  <th className="px-4 py-2">Créé le</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={5}>
                      Aucun utilisateur.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">
                        <form
                          method="POST"
                          action={route("admin.users.update-quota", u.id)}
                          className="flex items-center gap-2"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <input
                            type="number"
                            name="vods_quota"
                            min="0"
                            defaultValue={u.vods_quota ?? 0}
                            className="w-24 px-2 py-1 border rounded"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Sauver
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-2">
                        <form
                          method="POST"
                          action={route("admin.users.delete", u.id)}
                          onSubmit={(e) => {
                            if (!confirm(`Supprimer ${u.name} ?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-red-600 hover:underline">
                            Supprimer
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- CONTRACTORS TAB --- */}
      {activeTab === "contractors" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Approbations en attente</h2>
          {pendingContractors.length === 0 ? (
            <p className="text-gray-600">Aucune demande en attente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left uppercase text-gray-600">
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Entreprise</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingContractors.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.company_name || "N/A"}</td>
                      <td className="px-4 py-2 space-x-2">
                        <form
                          method="POST"
                          action={route("admin.contractors.approve", c.id)}
                          className="inline"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-green-600 hover:underline">
                            Approuver
                          </button>
                        </form>
                        <form
                          method="POST"
                          action={route("admin.contractors.reject", c.id)}
                          className="inline"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-red-600 hover:underline">
                            Rejeter
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="text-2xl font-semibold mt-10 mb-4">Contractants approuvés</h2>
          {approvedContractors.length === 0 ? (
            <p className="text-gray-600">Aucun contractant approuvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left uppercase text-gray-600">
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Entreprise</th>
                    <th className="px-4 py-2">Téléphone</th>
                    <th className="px-4 py-2">Rôle</th>
                    <th className="px-4 py-2">Créé le</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedContractors.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.company_name || "—"}</td>
                      <td className="px-4 py-2">{c.phone || "—"}</td>
                      <td className="px-4 py-2">{c.role || "—"}</td>
                      <td className="px-4 py-2">
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-2">
                        <form
                          method="POST"
                          action={route("admin.contractors.delete", c.id)}
                          onSubmit={(e) => {
                            if (!confirm("Supprimer ce contractant ?")) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-red-600 hover:underline">
                            Supprimer
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminDashboard;

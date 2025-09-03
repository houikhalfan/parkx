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
    sites = [],
  } = usePage().props;

  // lit l’onglet depuis l’URL (?tab=...)
  const getTabFromUrl = () => {
    if (typeof window === "undefined") return "parkx";
    const qs = new URLSearchParams(window.location.search);
    return qs.get("tab") || "parkx";
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  useEffect(() => setActiveTab(getTabFromUrl()), [url]);

  // Trouve le nom du site pour un user
  const siteNameFor = (u) =>
    u?.site?.name ??
    (u?.site_id ? (sites.find((s) => s.id === u.site_id)?.name || "—") : "—");

  return (
    <div>
<<<<<<< HEAD
=======
      {/* --- Tabs header --- */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          href={`${route("admin.dashboard")}?tab=parkx`}
          className={`px-3 py-1.5 rounded ${
            activeTab === "parkx" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Comptes ParkX
        </Link>
        <Link
          href={route("admin.contractors.pending")}
          className={`px-3 py-1.5 rounded ${
            activeTab === "contractors" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Comptes contractants
        </Link>
        <Link
          href={`${route("admin.dashboard")}?tab=documents`}
          className={`px-3 py-1.5 rounded ${
            activeTab === "documents" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Documents
        </Link>
      </div>

>>>>>>> 4b01387 (Documents Complete & Statistiques Without DASH)
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
              <label className="block text-sm font-medium mb-1">Site</label>
              <select
                name="site_id"
                className="w-full px-4 py-2 border rounded dark:bg-slate-900 dark:border-slate-700"
                defaultValue=""
              >
                <option value="">— Aucun —</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
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
                  <th className="px-4 py-2">Site</th>{/* <-- nouveau */}
                  <th className="px-4 py-2">VODs à rendre</th>
                  <th className="px-4 py-2">Créé le</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={6}>
                      Aucun utilisateur.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{siteNameFor(u)}</td>{/* <-- affichage */}
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

      {/* --- DOCUMENTS TAB --- */}
      {activeTab === "documents" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestion des Documents</h2>
            <Link
              href={route("admin.documents.create")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Nouveau Document
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">
              Gérez vos documents et contrôlez leur visibilité. Les documents publics sont accessibles à tous les utilisateurs, 
              tandis que les documents privés ne sont visibles que par les administrateurs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-blue-600 font-semibold text-lg">Documents</div>
                <div className="text-blue-800 text-sm">Gestion complète des fichiers</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold text-lg">Visibilité</div>
                <div className="text-green-800 text-sm">Contrôle d'accès public/privé</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-purple-600 font-semibold text-lg">Organisation</div>
                <div className="text-purple-800 text-sm">Catégorisation et recherche</div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={route("admin.documents.index")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accéder à la Gestion des Documents
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminDashboard;

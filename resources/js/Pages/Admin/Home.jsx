import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function AdminHome() {
  const { stats = {}, recentLogins = [], pendingApprovals = [] } = usePage().props;
  const completion = stats.vods_due > 0 ? Math.round((stats.vods_done / stats.vods_due) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Bienvenue, Admin 👋</h1>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi title="Comptes ParkX" value={stats.users} />
        <Kpi title="Contractants" value={stats.contractors} />
        <Kpi title={`VODs à rendre (${stats.month_label || ""})`} value={stats.vods_due} />
        <Kpi title="VODs complétés" value={stats.vods_done} />
      </section>

      {/* Rows */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Connexions récentes</h2>
            <Link href={route("admin.dashboard")} className="text-sm text-blue-600 hover:underline">
              Gérer les utilisateurs
            </Link>
          </div>
          {recentLogins.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune connexion récente.</p>
          ) : (
            <ul className="divide-y">
              {recentLogins.map((u) => (
                <li key={u.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{u.name || "—"}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString("fr-FR") : "Jamais"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Approbations en attente</h2>
            <Link href={`${route("admin.dashboard")}?tab=contractors`} className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {pendingApprovals.length === 0 ? (
            <p className="text-sm text-gray-600">Tout est à jour.</p>
          ) : (
            <ul className="divide-y">
              {pendingApprovals.map((c) => (
                <li key={c.id} className="py-2">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.email}{c.company_name ? ` • ${c.company_name}` : ""}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* VOD progress */}
      <section className="bg-white border rounded-xl p-6 mt-6">
        <h2 className="font-semibold mb-2">Progression VOD — {stats.month_label}</h2>
        <div className="text-sm text-gray-600 mb-2">
          {stats.vods_done} / {stats.vods_due} complétés
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-3 bg-blue-600" style={{ width: `${Math.min(100, completion)}%` }} />
        </div>
        <div className="mt-1 text-xs text-gray-500">{completion}%</div>
      </section>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value ?? 0}</div>
    </div>
  );
}

AdminHome.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminHome;

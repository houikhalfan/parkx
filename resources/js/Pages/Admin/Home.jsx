// resources/js/Pages/Admin/Home.jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  Users as UsersIcon,
  ClipboardList,
  CheckCircle2,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function AdminHome() {
  const { stats = {}, recentLogins = [], pendingApprovals = [] } = usePage().props;

  const completion =
    stats.vods_due > 0 ? Math.round((stats.vods_done / stats.vods_due) * 100) : 0;

  return (
    /* White page background */
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Tableau de bord</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Vue globale des métriques et activités de ParkX
          </p>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2.5 text-sm font-medium hover:opacity-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Générer un rapport
        </Link>
      </div>

      {/* KPI row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Comptes ParkX" value={stats.users ?? 0} delta={stats.delta_users} Icon={UsersIcon} />
        <StatCard title="Contractants" value={stats.contractors ?? 0} delta={stats.delta_contractors} Icon={ClipboardList} />
        <StatCard title={`VODs à rendre ${stats.month_label ? `(${stats.month_label})` : ""}`} value={stats.vods_due ?? 0} delta={stats.delta_vods_due} Icon={CalendarDays} />
        <StatCard title="VODs complétés" value={stats.vods_done ?? 0} delta={stats.delta_vods_done} Icon={CheckCircle2} />

        {/* VOD Progress under KPIs */}
        <VodProgressCard
          monthLabel={stats.month_label}
          done={stats.vods_done ?? 0}
          due={stats.vods_due ?? 0}
          completion={completion}
          className="lg:col-span-4"
        />
      </section>

      {/* Two columns */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Activité récente */}
        <div className="card-frame p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Activité récente</h2>
          <p className="text-sm text-gray-600 mb-4">Dernières connexions des utilisateurs</p>

          {recentLogins.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune connexion récente.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentLogins.map((u) => (
                <li key={u.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{u.name || "—"}</div>
                      <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString("fr-FR") : "Jamais"}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 text-right">
            <Link href={route("admin.dashboard")} className="text-sm font-medium hover:underline">
              Gérer les utilisateurs
            </Link>
          </div>
        </div>

        {/* Approbations en attente */}
        <div className="card-frame p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Approbations en attente</h2>
          <p className="text-sm text-gray-600 mb-4">Comptes contractants en attente de validation</p>

          {pendingApprovals.length === 0 ? (
            <p className="text-sm text-gray-600">Tout est à jour.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingApprovals.map((c) => (
                <li key={c.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {c.email}
                        {c.company_name ? ` • ${c.company_name}` : ""}
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium">
                      En attente
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 text-right">
            <Link href={`${route("admin.dashboard")}?tab=contractors`} className="text-sm font-medium hover:underline">
              Voir tout
            </Link>
          </div>
        </div>
      </section>

      {/* Local styles: card frame + pro numeric font */}
      <style>{`
        /* Load Inter for a professional numeric look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');

        .numpro {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
          font-variant-numeric: tabular-nums lining-nums slashed-zero;
          font-feature-settings: "tnum" 1, "lnum" 1, "zero" 1;
          letter-spacing: -0.02em; /* slightly tighter like pro dashboards */
        }

        .card-frame {
          background-color: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 8px 24px -12px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}

/* ---------- components ---------- */
function StatCard({ title, value, delta, Icon }) {
  const isNumber = typeof delta === "number";
  const positive = isNumber ? delta >= 0 : null;

  return (
    <div className="card-frame p-5 sm:p-6 relative">
      {/* title row like the reference */}
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {Icon && <Icon size={18} className="opacity-40" />}
      </div>

      {/* big number with pro numeric font */}
      <div className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black numpro">
        {formatNumber(value)}
      </div>

      {/* delta (optional) with pro numeric font */}
      {isNumber && (
        <div
          className={[
            "mt-1 inline-flex items-center gap-1 text-xs font-medium numpro",
            positive ? "text-emerald-600" : "text-rose-600",
          ].join(" ")}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(delta)}% vs mois dernier
        </div>
      )}
    </div>
  );
}

function VodProgressCard({ monthLabel, done, due, completion, className = "" }) {
  const color =
    completion >= 80 ? "text-emerald-600" : completion >= 40 ? "text-amber-600" : "text-rose-600";

  return (
    <div className={`card-frame p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-sm font-medium text-gray-900">Progression VOD — {monthLabel || "-"}</h2>
          <p className="text-sm text-gray-600 mt-1 numpro">
            {done} / {due} complétés
          </p>
        </div>
        <div className={`text-sm md:text-base font-medium numpro ${color}`}>{completion}%</div>
      </div>

      <div className="mt-4 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600"
          style={{ width: `${Math.min(100, completion)}%` }}
        />
      </div>
    </div>
  );
}

function formatNumber(n) {
  if (n == null) return "0";
  try {
    return new Intl.NumberFormat("fr-FR").format(n);
  } catch {
    return String(n);
  }
}

AdminHome.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminHome;

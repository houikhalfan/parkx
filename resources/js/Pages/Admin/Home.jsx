import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function AdminHome() {
  const { stats = {}, recentLogins = [], pendingApprovals = [], pendingCount = 0, csrf_token } = usePage().props;
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const completion = stats.vods_due > 0 ? Math.round((stats.vods_done / stats.vods_due) * 100) : 0;

  // Active link helper (évite que /admin soit actif sur /admin/home)
  const isActive = (href) => {
    if (href === '/admin') return url === '/admin' || url.startsWith('/admin?');
    return url === href;
  };

  const navItems = [
    { key: 'home', label: 'Accueil', href: '/admin/home' },
    { key: 'parkx', label: 'Comptes ParkX', href: '/admin' },
    { key: 'contractors', label: 'Comptes contractants', href: '/admin?tab=contractors', badge: pendingCount },
  ];

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* ── Mobile header with hamburger ─────────────────────────────── */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white border-b px-4 py-3 md:hidden">
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
        >
          {/* hamburger */}
          <svg width="24" height="24" fill="currentColor"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="font-semibold">Tableau d’administration</div>
        <div className="w-8" /> {/* spacer */}
      </div>

      {/* ── Mobile drawer sidebar ────────────────────────────────────── */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        {/* overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* drawer */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent
            navItems={navItems}
            isActive={isActive}
            csrf_token={csrf_token}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>
      </div>

      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:bg-white md:shadow-md">
        <SidebarContent navItems={navItems} isActive={isActive} csrf_token={csrf_token} />
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-8">
        {/* En-tête */}
        <header className="bg-white border rounded-2xl mb-6">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Bienvenue, Admin 👋</h1>
              <p className="text-sm text-gray-500">Accueil</p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Cartes KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard title="Comptes ParkX" value={stats.users} hint="Total utilisateurs" icon="👤" />
          <KpiCard title="Contractants" value={stats.contractors} hint="Total contractants" icon="👷" />
          <KpiCard title={`VODs à rendre (${stats.month_label || ''})`} value={stats.vods_due} hint="Ce mois-ci" icon="📋" />
          <KpiCard title="VODs terminés" value={stats.vods_done} hint="Ce mois-ci" icon="✅" />
        </section>

        {/* Deux colonnes : Connexions récentes + Approbations en attente */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Connexions récentes</h2>
              <Link href="/admin" className="text-sm text-blue-600 hover:underline">Gérer les utilisateurs</Link>
            </div>
            {recentLogins.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune connexion récente.</p>
            ) : (
              <ul className="divide-y">
                {recentLogins.map((u) => (
                  <li key={u.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {(u.name || u.email || '?').slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{u.name || '—'}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString('fr-FR') : 'Jamais'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Approbations en attente</h2>
              <Link href="/admin?tab=contractors" className="text-sm text-blue-600 hover:underline">Tout voir</Link>
            </div>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-gray-500">Tout est à jour. Aucune approbation en attente.</p>
            ) : (
              <ul className="divide-y">
                {pendingApprovals.map((c) => (
                  <li key={c.id} className="py-3">
                    <div className="font-medium text-sm">{c.name || '—'}</div>
                    <div className="text-xs text-gray-500">
                      {c.email} {c.company_name ? `• ${c.company_name}` : ''}
                    </div>
                    <form method="POST" action={`/admin/contractors/${c.id}/approve`} className="mt-2">
                      <input type="hidden" name="_token" value={csrf_token} />
                      <button type="submit" className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">
                        Approuver
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Progression des VOD */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Progression des VOD — {stats.month_label}</h2>
            <Link href="/vods/history" className="text-sm text-blue-600 hover:underline">Aller aux VODs</Link>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {stats.vods_done} / {stats.vods_due} terminés
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-blue-600" style={{ width: `${Math.min(100, completion)}%` }} />
          </div>
          <div className="mt-2 text-xs text-gray-500">{completion}% complété</div>
        </section>
      </main>
    </div>
  );
}

function SidebarContent({ navItems, isActive, csrf_token, onNavigate }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="px-6 py-4 text-xl font-bold border-b">Tableau d’administration</div>
        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`w-full flex justify-between items-center px-4 py-2 rounded block ${
                isActive(item.href) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              <span>{item.label}</span>
              {!!item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-4 py-4 border-t">
        <form method="POST" action="/admin/logout">
          <input type="hidden" name="_token" value={csrf_token} />
          <button className="w-full py-2 text-sm text-red-600 hover:underline">Se déconnecter</button>
        </form>
      </div>
    </div>
  );
}

function KpiCard({ title, value, hint, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold">{value ?? 0}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

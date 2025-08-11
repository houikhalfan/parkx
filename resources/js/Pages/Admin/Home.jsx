import React from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function AdminHome() {
  const { stats = {}, recentLogins = [], pendingApprovals = [], pendingCount = 0, csrf_token } = usePage().props;
  const completion = stats.vods_due > 0 ? Math.round((stats.vods_done / stats.vods_due) * 100) : 0;

  const pathname = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  const navItems = [
    { key: 'home', label: 'Home', href: '/admin/home' },
    { key: 'parkx', label: 'ParkX Accounts', href: '/admin' },
    { key: 'contractors', label: 'Contractor Accounts', href: '/admin?tab=contractors', badge: pendingCount },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (same vibe as your Dashboard.jsx) */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Admin Dashboard</div>
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
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
            <button className="w-full py-2 text-sm text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border rounded-2xl mb-6">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, Admin 👋</h1>
              <p className="text-sm text-gray-500">Home</p>
            </div>
            <div className="text-sm text-gray-500">{new Date().toLocaleString()}</div>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard title="ParkX Accounts" value={stats.users} hint="Total users" icon="👤" />
          <KpiCard title="Contractors" value={stats.contractors} hint="Total contractors" icon="👷" />
          <KpiCard title={`VODs Due (${stats.month_label || ''})`} value={stats.vods_due} hint="This month" icon="📋" />
          <KpiCard title="Completed VODs" value={stats.vods_done} hint="This month" icon="✅" />
        </section>

        {/* Two Column: Recent Logins + Pending Approvals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Recent Logins</h2>
              <Link href="/admin" className="text-sm text-blue-600 hover:underline">Manage Users</Link>
            </div>
            {recentLogins.length === 0 ? (
              <p className="text-sm text-gray-500">No recent logins.</p>
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
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Pending Approvals</h2>
              <Link href="/admin?tab=contractors" className="text-sm text-blue-600 hover:underline">Review all</Link>
            </div>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-gray-500">All caught up. No pending contractor approvals.</p>
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
                        Approve
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* VOD Progress */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">VOD Progress — {stats.month_label}</h2>
            <Link href="/vods/history" className="text-sm text-blue-600 hover:underline">Go to VODs</Link>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {stats.vods_done} / {stats.vods_due} completed
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-blue-600" style={{ width: `${Math.min(100, completion)}%` }} />
          </div>
          <div className="mt-2 text-xs text-gray-500">{completion}% complete</div>
        </section>
      </main>
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

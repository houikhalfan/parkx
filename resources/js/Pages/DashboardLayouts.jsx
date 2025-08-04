import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
  const { auth } = usePage().props;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-[#f1f1f1] text-gray-900 flex flex-col items-center py-6 shadow-lg">
        <div className="mb-4">
          <img src="/images/logo.png" alt="Logo" className="h-14 mx-auto" />
        </div>
        <div className="mb-6 text-center">
          <p className="font-semibold text-lg">{auth?.user?.name || 'Utilisateur'}</p>
        </div>
        <nav className="w-full px-4 space-y-2">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/vods" label="VODS" />
          <NavLink href="/vods/history" label="Historique VODS" />
          <NavLink href="/vods/notifications" label="Notifications" />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

function NavLink({ href, label }) {
  const isActive = window.location.pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
      }`}
    >
      {label}
    </Link>
  );
}

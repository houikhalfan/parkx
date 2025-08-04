import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
  const { auth } = usePage().props;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 text-[#1f2937] flex flex-col items-center py-6 shadow-lg border-r border-gray-200">
        {/* Logo */}
        <div className="mb-6">
          <img src="/images/logo.png" alt="Logo" className="h-12 mx-auto" />
        </div>

        {/* User Info */}
        <div className="mb-8 text-center">
          <p className="font-semibold text-lg">{auth?.user?.name || 'Utilisateur'}</p>
        </div>

        {/* Navigation */}
        <nav className="w-full px-4 space-y-2">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/vods" label="VODS" />
          <NavLink href="#" label="Autre Option" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

// Custom NavLink Component
function NavLink({ href, label }) {
  const isActive = window.location.pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-blue-100 text-blue-800 font-semibold'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </Link>
  );
}

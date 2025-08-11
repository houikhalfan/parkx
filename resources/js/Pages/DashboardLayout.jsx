import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
  const { auth, quota } = usePage().props;
  const remaining = Math.max(0, quota?.remaining ?? 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toasts (fixed top-right) */}
      <FlashToaster />

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

          {/* VODS with badge showing remaining to submit this month */}
          <NavLink
            href="/vods"
            label="VODS"
            matchPrefix="/vods"
            badge={remaining > 0 ? (remaining > 99 ? '99+' : remaining) : null}
          />

          <NavLink href="#" label="Autre Option" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

// --- Toast component (auto-fade) ---
function FlashToaster() {
  const { flash = {} } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState('success');

  useEffect(() => {
    if (flash?.success) {
      setMsg(flash.success);
      setType('success');
      setVisible(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (flash?.error) {
      setMsg(flash.error);
      setType('error');
      setVisible(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [flash?.success, flash?.error]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(t);
  }, [visible]);

  if (!msg) return null;

  const base = 'rounded shadow-lg px-4 py-3 border relative transition-opacity duration-500';
  const palette =
    type === 'success'
      ? 'bg-green-50 border-green-400 text-green-700'
      : 'bg-red-50 border-red-400 text-red-700';

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role={type === 'success' ? 'status' : 'alert'}
      aria-live="polite"
    >
      <div className={`${base} ${palette}`}>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute top-1 right-2 text-inherit/70"
          aria-label="Fermer"
        >
          ×
        </button>
        <strong className="font-medium">{msg}</strong>
      </div>
    </div>
  );
}

// Custom NavLink Component with optional badge
function NavLink({ href, label, matchPrefix, badge }) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = matchPrefix ? path.startsWith(matchPrefix) : path === href;

  return (
    <div className="relative">
      {badge != null && (
        <span
          className="absolute -top-2 -right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white shadow"
          aria-label={`${badge} VODs restants`}
          title={`${badge} VODs restants`}
        >
          {badge}
        </span>
      )}
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
    </div>
  );
}

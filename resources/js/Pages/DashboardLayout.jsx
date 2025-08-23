import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children, menuMode = 'default' }) {
  const { auth, quota } = usePage().props;
  const { url = (typeof window !== 'undefined' ? window.location.pathname : '') } = usePage();
  const remaining = Math.max(0, quota?.remaining ?? 0);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setSidebarOpen(false); }, [url]);

  // ESC to close drawer
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    if (sidebarOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  return (
    <div className={`min-h-screen bg-gray-100 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
      {/* Toasts */}
      <FlashToaster />

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 bg-white border-b md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-2 rounded-md border hover:bg-gray-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img src="/images/logo.png" alt="Logo" className="h-8" />
          <span className="text-sm text-gray-700 font-medium">{auth?.user?.name || 'Utilisateur'}</span>
        </div>
      </div>

      {/* Mobile drawer + overlay */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu latéral"
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-gray-50 text-[#1f2937] shadow-xl border-r
                      transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <img src="/images/logo.png" alt="Logo" className="h-10" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <SidebarContent
            auth={auth}
            remaining={remaining}
            menuMode={menuMode}
            onNavigate={() => setSidebarOpen(false)}
          />
        </aside>
      </div>

      {/* Desktop static sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-gray-50 text-[#1f2937] py-6 shadow-lg border-r">
        <div className="px-6 mb-6">
          <img src="/images/logo.png" alt="Logo" className="h-12 mx-auto" />
        </div>
        <div className="px-6 mb-6 text-center">
          <p className="font-semibold text-lg">{auth?.user?.name || 'Utilisateur'}</p>
        </div>
        <SidebarContent auth={auth} remaining={remaining} menuMode={menuMode} />
      </aside>

      {/* Main content (push right on desktop) */}
      <main className="md:pl-64 p-6">{children}</main>
    </div>
  );
}

/* ---- Shared sidebar content ---- */
function SidebarContent({ remaining, onNavigate, menuMode = 'default' }) {
  const navDefault = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'VODS', href: '/vods', matchPrefix: ['/vods'], badge: remaining > 0 ? (remaining > 99 ? '99+' : remaining) : null },
    { label: 'Autre Option', href: '/vods/history' },
  ];

  const navStats = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Statistiques', href: '/contractor/stats/new', matchPrefix: ['/contractor/stats/new', '/contractor/stats'] },
    { label: 'Historique', href: '/contractor/stats/history', matchPrefix: ['/contractor/stats/history'] },
  ];

  const items = menuMode === 'stats' ? navStats : navDefault;

  return (
    <nav className="px-4 space-y-2">
      {items.map((i) => (
        <NavLink
          key={i.href}
          href={i.href}
          label={i.label}
          matchPrefix={i.matchPrefix}
          badge={i.badge}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

/* ---- Toasts (auto-fade) ---- */
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

/* ---- NavLink with active & optional badge ---- */
function NavLink({ href, label, matchPrefix, badge, onNavigate }) {
  const { url = (typeof window !== 'undefined' ? window.location.pathname : '') } = usePage();
  const prefixes = Array.isArray(matchPrefix)
    ? matchPrefix
    : matchPrefix
    ? [matchPrefix]
    : [];
  const isActive = prefixes.length ? prefixes.some((p) => url.startsWith(p)) : url === href;

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
        onClick={onNavigate}
        className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Menu, Sun, Moon, Bell, Search, Home,
  LayoutDashboard, FileText, History, BellRing, FileSignature
} from 'lucide-react';

export default function DashboardLayout({ children, title }) {
  const { auth = {}, counts = {} } = usePage().props || {};
  const user = auth.user || {};
  const assigned = counts.assigned_papers ?? 0;
  const vodsRemaining = counts.vods_remaining ?? 0;
  const totalNotifs = (counts.notifications ?? 0) + assigned + (vodsRemaining > 0 ? 1 : 0);

  /* theme (persist) */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const stored = localStorage.getItem('parkx-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next = stored || (prefersDark ? 'dark' : 'light');
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('parkx-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  /* layout state */
  const { url = (typeof window !== 'undefined' ? window.location.pathname : '/') } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  useEffect(() => { setNotifOpen(false); setSidebarOpen(false); }, [url]);

  const pageTitle = title || usePage()?.component?.split('/').slice(-1)[0] || 'CMS';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur border-b border-gray-200 dark:border-slate-700">
        <div className="h-14 flex items-center gap-3 px-3 sm:px-4">
          {/* Burger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/images/logo.png" className="h-7 w-7 rounded-md" alt="Logo" />
            <span className="font-semibold">Parkx</span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center text-sm text-gray-500 dark:text-slate-300 ml-2">
            <Home size={16} className="mr-1" />
            <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-white">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{pageTitle}</span>
          </nav>

          {/* Search */}
          <div className="ml-auto relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700/70 border border-transparent focus:border-blue-400 outline-none text-sm placeholder-gray-400 dark:placeholder-slate-300"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {totalNotifs > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 text-[11px] font-semibold bg-rose-500 text-white rounded-full">
                  {totalNotifs > 99 ? '99+' : totalNotifs}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                onMouseLeave={() => setNotifOpen(false)}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
                  Notifications
                </div>
                <ul className="max-h-72 overflow-auto text-sm">
                  <NotifItem count={assigned} label="Papiers assignés à signer" href={route('employee.signatures.index', {}, false)} color="text-blue-600" />
                  <NotifItem
                    count={vodsRemaining}
                    label="VODs restants ce mois"
                    href="/vods"
                    color="text-emerald-600"
                    showZero={false}
                  />
                </ul>
                <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
                  <Link href="/vods/notifications" className="text-xs text-gray-600 dark:text-slate-300 hover:underline">
                    Voir tout
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="pl-2 ml-1 border-l border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-sm font-medium truncate">{user?.name || 'Utilisateur'}</div>
              <div className="text-[11px] text-gray-500 dark:text-slate-300 truncate">{user?.role || 'ParkX'}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-xs font-semibold">
              {initials(user?.name)}
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR + MAIN WRAPPER */}
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:flex-col md:w-[280px] md:min-h-[calc(100vh-56px)] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
          {/* Brand row to mimic screenshot spacing */}
          <div className="h-4" />

          <nav className="px-4 py-4 space-y-6">
            <NavSection title="OVERVIEW">
              <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            </NavSection>

            <NavSection title="VODS & SIGNATURES">
              <NavItem href="/vods" icon={FileText} label="VODS" />
              <NavItem href="/vods/history" icon={History} label="Historique VODS" />
              <NavItem
                href="/vods/notifications"
                icon={BellRing}
                label="Notifications"
                badge={totalNotifs || null}
              />
             <NavItem href={route('employee.signatures.index', {}, false)} icon={FileSignature} label="Papiers assignés" badge={assigned || null} />
            </NavSection>
          </nav>
        </aside>

        {/* Sidebar (mobile drawer) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-[85vw] max-w-[320px] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-xl">
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <img src="/images/logo.png" className="h-7 w-7 rounded-md" alt="" />
                  <span className="font-semibold">CMSFullForm</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <nav className="px-4 py-4 space-y-6">
                <NavSection title="OVERVIEW">
                  <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                </NavSection>
                <NavSection title="VODS & SIGNATURES">
                  <NavItem href="/vods" icon={FileText} label="VODS" />
                  <NavItem href="/vods/history" icon={History} label="Historique VODS" />
                  <NavItem
                    href="/vods/notifications"
                    icon={BellRing}
                    label="Notifications"
                    badge={totalNotifs || null}
                  />
                <NavItem href={route('employee.signatures.index', {}, false)} icon={FileSignature} label="Papiers assignés" badge={assigned || null} />
                </NavSection>
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-3 sm:px-4 py-4">
          {/* subtle container to match screenshot cards */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Sidebar pieces ---------- */

function NavSection({ title, children }) {
  return (
    <div>
      <div className="px-2 text-[11px] font-semibold tracking-wide text-gray-400 dark:text-slate-400 uppercase mb-2">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, badge }) {
  const { url = (typeof window !== 'undefined' ? window.location.pathname : '/') } = usePage();
  const active = url === href || (href !== '/' && url.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm
        ${active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
    >
      <span className="flex items-center gap-2">
        <Icon size={18} />
        {label}
      </span>
      {badge != null && (
        <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] rounded-full bg-rose-500 text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

/* ---------- Header helpers ---------- */

function NotifItem({ count, label, href, color = 'text-blue-600', showZero = true }) {
  if (!showZero && !count) return null;
  return (
    <li>
      <Link href={href} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700">
        <span>{label}</span>
        <span className={`text-xs font-semibold ${color}`}>{count}</span>
      </Link>
    </li>
  );
}

function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  const a = (parts[0] || '').charAt(0);
  const b = (parts[1] || '').charAt(0);
  return (a + b).toUpperCase() || 'U';
}

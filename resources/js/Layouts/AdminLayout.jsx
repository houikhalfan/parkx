// resources/js/Layouts/AdminLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  Mail,
  Package,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Folder,
} from "lucide-react";

export default function AdminLayout({ children }) {
const { csrf_token, admin } = usePage().props || {};
  const { url: currentUrl = "" } = usePage(); // ✅ reactive URL from Inertia

  // --------- helpers ----------
  const active = (pattern) => new RegExp(pattern).test(currentUrl || "");

  // MOBILE drawer (slide in/out)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DESKTOP collapse (full → icons-only)
  const [collapsed, setCollapsed] = useState(false);

  // theme persists for main/topbar (sidebar stays black)
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  // user dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const adminName  = admin?.name  ?? "Admin";
const adminEmail = admin?.email ?? "";

  // ----- nav items -----
  const items = [
    {
      label: "Accueil",
      href: route("admin.home"),
      match: "^/admin/home$",
      Icon: LayoutDashboard,
    },
    {
  label: "Sites",
  href: route("admin.sites.index"),
  match: "^/admin/sites",
  Icon: Folder, // or any icon you prefer
},
    {
      label: "Comptes ParkX",
      href: route("admin.dashboard"),
      match: "^/admin\\?$|^/admin$|^/admin\\?tab=parkx",
      Icon: Users,
    },
    {
      label: "Comptes contractants",
      href: `${route("admin.dashboard")}?tab=contractors`,
      match: "^/admin\\?tab=contractors",
      Icon: Package,
    },
    {
      label: "Signatures",
      href: route("admin.signatures.index"),
      match: "^/admin/signatures",
      Icon: Mail,
    },

  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      {/* ===== Sidebar ===== */}
      <aside
        aria-label="Sidebar"
        className={[
          "fixed inset-y-0 left-0 z-40 border-r bg-black text-white",
          "transform transition-transform duration-200 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",      // mobile slide
          "lg:!translate-x-0 lg:transition-none",                   // ✅ fixed open on lg
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-64",
          "border-neutral-800",
          "transition-all duration-200 ease-in-out",
        ].join(" ")}
      >
        {/* Top row: logo + collapse toggle */}
        <div className="flex items-center justify-between gap-2 px-3 h-14 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img
              src="/images/white.jpg"
              className={`h-16 w-auto ${collapsed ? "opacity-0 pointer-events-none" : ""}`}
              alt="Logo"
            />
          </div>

          {/* Collapse (desktop) */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
            aria-label="Toggle sidebar"
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
            aria-label="Fermer"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Search (expanded only) */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={16} />
              <input
                type="text"
                placeholder="Rechercher…"
                className="w-full rounded-lg bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 dark:placeholder-white/60"
              />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="px-2 py-3 space-y-1.5">
          {items.map(({ label, href, match, Icon }) => {
            const isActive = active(match);
            return (
              <NavItem
                key={label}
                href={href}
                Icon={Icon}
                label={label}
                active={isActive}
                collapsed={collapsed}
                onClick={() => setSidebarOpen(false)}
              />
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto border-t border-white/10">
          {/* Profile preview (expanded) */}
          <div className={`px-3 py-3 ${collapsed ? "hidden" : "flex items-center gap-3"}`}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-semibold">
              {adminName?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{adminName}</div>
              {adminEmail && <div className="truncate text-xs text-white/60">{adminEmail}</div>}
            </div>
          </div>

          {/* Logout */}
          <div className="px-2 py-3">
            <form method="POST" action={route("admin.logout")}>
              <input type="hidden" name="_token" value={csrf_token} />
              <button
                type="submit"
                className={`${
                  collapsed
                    ? "w-10 h-10 grid place-items-center rounded-md hover:bg-white/10 mx-auto"
                    : "w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10"
                } text-red-400`}
                title="Se déconnecter"
              >
                <LogOut size={18} />
                {!collapsed && <span>Se déconnecter</span>}
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile only */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      {/* ===== Main column ===== */}
      <div className={`${collapsed ? "lg:ml-16" : "lg:ml-64"} flex min-h-screen flex-col transition-all duration-200`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 border-b bg-white/90 backdrop-blur dark:bg-slate-900/90 dark:border-slate-700">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4">
            {/* Left: hamburger (mobile) + small logo */}
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 lg:hidden dark:hover:bg-slate-800"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Ouvrir le menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img src="/images/logo.png" className="h-6 w-auto lg:hidden" alt="Logo" />
            </div>

            {/* Right: theme, notifications, user */}
            <div className="flex items-center gap-1">
              {/* theme */}
              <button
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* notifications (placeholder) */}
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                title="Notifications"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5" />
                  <path d="M13 21a2 2 0 0 1-2 0" />
                </svg>
              </button>

              {/* user menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <div className="max-w-[8rem] truncate text-sm text-gray-700 dark:text-slate-200">
                    {adminName}
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                    {adminName?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b px-4 py-3 dark:border-slate-700">
                      <div className="text-sm font-medium">{adminName}</div>
                      {adminEmail && (
                        <div className="truncate text-xs text-gray-500 dark:text-slate-400">{adminEmail}</div>
                      )}
                    </div>
                    <ul className="py-1 text-sm">
                      <li>
                        <Link href="#" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/60">
                          Profil
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/60">
                          Paramètres
                        </Link>
                      </li>
                    </ul>
                    <div className="border-t dark:border-slate-700">
                      <form method="POST" action={route("admin.logout")}>
                        <input type="hidden" name="_token" value={csrf_token} />
                        <button
                          type="submit"
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-slate-700/60"
                        >
                          Se déconnecter
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/* -------- components -------- */
function NavItem({ href, Icon, label, active, collapsed, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group relative flex items-center rounded-md",
        collapsed ? "justify-center px-0 py-2 h-10" : "px-3 py-2 gap-3",
        active ? "bg-white text-gray-900 shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <Icon size={18} className={active ? "" : "opacity-90"} />
      {!collapsed && <span className="text-sm">{label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow opacity-0 group-hover:opacity-100">
          {label}
        </span>
      )}
    </Link>
  );
}

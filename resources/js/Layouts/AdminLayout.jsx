import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
  const { url, csrf_token } = usePage().props;

  // mark active by regex against current url (query string included)
  const active = (pattern) => new RegExp(pattern).test(url || "");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Tableau d’administration</div>
          <nav className="px-4 py-4 space-y-2">
            <Link
              href={route("admin.home")}
              className={`block px-4 py-2 rounded ${
                active("^/admin/home$") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Accueil
            </Link>

            <Link
              href={route("admin.dashboard")}
              className={`block px-4 py-2 rounded ${
                active("^/admin\\?$|^/admin$|^/admin\\?tab=parkx") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Comptes ParkX
            </Link>

            <Link
              href={`${route("admin.dashboard")}?tab=contractors`}
              className={`block px-4 py-2 rounded ${
                active("^/admin\\?tab=contractors") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Comptes contractants
            </Link>

            <Link
              href={route("admin.signatures.index")}
              className={`block px-4 py-2 rounded ${
                active("^/admin/signatures") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Signatures
            </Link>
          </nav>
        </div>

        <div className="px-4 py-4 border-t">
          <form method="POST" action={route("admin.logout")}>
            <input type="hidden" name="_token" value={csrf_token} />
            <button className="w-full py-2 text-sm text-red-600 hover:underline">Se déconnecter</button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}

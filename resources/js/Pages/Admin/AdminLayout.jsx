// resources/js/Layouts/AdminLayout.jsx
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
  const { csrf_token } = usePage().props;
  const { url } = usePage(); // ensure you're using the reactive URL
  const active = (re) => new RegExp(re).test(url);

  return (
    // isolate => new stacking context so main content can't cover the aside
    <div className="flex h-screen bg-gray-100 isolate">
      {/* Sidebar is on top of anything the page renders */}
      <aside className="w-64 bg-white shadow flex flex-col justify-between relative z-50 pointer-events-auto">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Admin Dashboard</div>
          <nav className="px-4 py-4 space-y-2">
            <Link
              href={route("admin.home")}
              className={`block px-4 py-2 rounded ${
                active("^/admin/home$") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Home
            </Link>
            <Link
              href={route("admin.dashboard")}
              className={`block px-4 py-2 rounded ${
                active("^/admin(?:\\?.*)?$") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Comptes ParkX
            </Link>
            <Link
              href={route("admin.dashboard") + "?tab=contractors"}
              className={`block px-4 py-2 rounded ${
                active("^/admin\\?tab=contractors$") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Comptes Contractant
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
          <form method="POST" action="/admin/logout">
            <input type="hidden" name="_token" value={csrf_token} />
            <button className="w-full py-2 text-sm text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main stays below the sidebar in stacking order */}
      <main className="flex-1 p-8 overflow-y-auto relative z-0">{children}</main>
    </div>
  );
}

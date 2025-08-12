// resources/js/Layouts/AdminLayout.jsx
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
  const { csrf_token, url } = usePage().props;
  const active = (re) => new RegExp(re).test(url);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Admin Dashboard</div>
          <nav className="px-4 py-4 space-y-2">
            <Link href={route("admin.home")}
              className={`block px-4 py-2 rounded ${active("^/admin$|^/admin/home$") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}`}>
              Home
            </Link>
            <Link href={route("admin.parkx.index")}
              className={`block px-4 py-2 rounded ${active("^/admin/parkx") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}`}>
              ParkX Accounts
            </Link>
            <Link href={route("admin.contractors.index")}
              className={`block px-4 py-2 rounded ${active("^/admin/contractors") ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}`}>
              Contractor Accounts
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

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

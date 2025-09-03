// resources/js/Layouts/AdminLayout.jsx
import { Link, usePage } from '@inertiajs/react';

const hasRoute = (name) =>
  typeof route === 'function' && route().has ? route().has(name) : false;

const r = (name, params) => {
  // Return a usable href or "#" if the route isn't available to the client
  if (typeof route !== 'function') return '#';
  if (route().has && !route().has(name)) return '#';
  try { return route(name, params); } catch { return '#'; }
};

export default function AdminLayout({ children }) {
  const { csrf_token } = usePage().props || {};
  const { url } = usePage(); // reactive url from Inertia
  const active = (re) => new RegExp(re).test(url || '');

  return (
    <div className="flex h-screen bg-gray-100 isolate">
      <aside className="w-64 bg-white shadow flex flex-col justify-between relative z-50">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Admin Dashboard</div>
          <nav className="px-4 py-4 space-y-2">
            <Link
              href={r('admin.home')}
              className={`block px-4 py-2 rounded ${
                active('^/admin/home$') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Home
            </Link>

            <Link
                              href={r('admin.home')}
              className={`block px-4 py-2 rounded ${
                active('^/admin(?:\\?.*)?$') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Comptes ParkX
            </Link>

            <Link
                              href={`${r('admin.home')}?tab=contractors`}
              className={`block px-4 py-2 rounded ${
                active('^/admin\\?tab=contractors$') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Comptes Contractant
            </Link>

            <Link
              href={r('admin.signatures.index')}
              className={`block px-4 py-2 rounded ${
                active('^/admin/signatures') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Signatures
            </Link>

            {/* Example of an optional link: only render if the named route exists */}
            {hasRoute('admin.stats.index') && (
              <Link
                href={r('admin.stats.index')}
                className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-100"
              >
                Statistiques
              </Link>
            )}
          </nav>
        </div>

        <div className="px-4 py-4 border-t">
          <form method="POST" action="/admin/logout">
            <input type="hidden" name="_token" value={csrf_token || ''} />
            <button className="w-full py-2 text-sm text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative z-0">{children}</main>
    </div>
  );
}

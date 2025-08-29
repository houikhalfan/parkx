import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ContractantLayout({ children }) {
  const { url } = usePage();

  const nav = [
    { href: '/contractant/parapheur',    label: 'Paraphe & Signature' },
    { href: '/contractant/documents',    label: 'Documents' },
    { href: '/contractant/statistiques', label: 'Statistiques' },
    { href: '/contractant/vods',         label: 'VODs' }, 
    // add route when ready
  ];

  const isActive = (href) => url.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (only on inner pages) */}
      <aside className="w-64 bg-white border-r hidden md:flex md:flex-col">
        <div className="px-5 py-4 border-b">
          <div className="font-semibold">Espace Contractant</div>
          <div className="text-xs text-gray-500">Services</div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(i => (
            <Link
              key={i.href}
              href={i.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive(i.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">
        {/* Topbar (mobile) */}
        <div className="md:hidden bg-white border-b px-4 py-3">
          <div className="text-sm font-medium">Espace Contractant</div>
          <div className="text-xs text-gray-500">Services</div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

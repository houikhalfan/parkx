import React, { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function AdminDashboard() {
  const { pendingContractors = [], approvedContractors = [], csrf_token, users = [] } = usePage().props;
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getTabFromUrl = () => {
    if (typeof window === 'undefined') return 'parkx';
    const qs = new URLSearchParams(window.location.search);
    return qs.get('tab') || 'parkx';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  useEffect(() => setActiveTab(getTabFromUrl()), [url]);

  const isActive = (href) => {
    if (href === '/admin') return url === '/admin' || url.startsWith('/admin?');
    return url === href;
  };

  const navItems = [
    { key: 'home', label: 'Accueil', href: '/admin/home' },
    { key: 'parkx', label: 'Comptes ParkX', href: '/admin' },
    { key: 'contractors', label: 'Comptes contractants', href: '/admin?tab=contractors', badge: pendingContractors.length },
  ];

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white border-b px-4 py-3 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 hover:bg-gray-100" aria-label="Ouvrir le menu">
          <svg width="24" height="24" fill="currentColor"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="font-semibold">Tableau d’administration</div>
        <div className="w-8" />
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-black/30 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent navItems={navItems} isActive={isActive} csrf_token={csrf_token} onNavigate={() => setMobileOpen(false)} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:bg-white md:shadow-md">
        <SidebarContent navItems={navItems} isActive={isActive} csrf_token={csrf_token} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* ParkX Account Management */}
        {activeTab === 'parkx' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Créer un compte ParkX</h2>
            <form method="POST" action="/admin/users" className="space-y-4 bg-white p-6 rounded shadow max-w-md mb-8">
              <input type="hidden" name="_token" value={csrf_token} />
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" name="name" placeholder="Nom complet" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input type="password" name="password" placeholder="Mot de passe" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input type="password" name="password_confirmation" placeholder="Confirmer" className="w-full px-4 py-2 border rounded" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Créer l’utilisateur
              </button>
            </form>

            {/* Users table */}
            <h3 className="text-xl font-semibold mb-3">Tous les comptes ParkX</h3>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left uppercase text-gray-600">
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">VODs à rendre</th>
                    <th className="px-4 py-2">Créé le</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-gray-600" colSpan={5}>Aucun utilisateur.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">
                          <form method="POST" action={`/admin/users/${u.id}/update-quota`} className="flex items-center gap-2">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <input type="number" name="vods_quota" min="0" defaultValue={u.vods_quota ?? 0} className="w-20 px-2 py-1 border rounded" />
                            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Sauver</button>
                          </form>
                        </td>
                        <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2">
                          <form method="POST" action={`/admin/users/${u.id}/delete`} onSubmit={(e) => { if (!confirm(`Supprimer ${u.name} ?`)) e.preventDefault(); }}>
                            <input type="hidden" name="_token" value={csrf_token} />
                            <button type="submit" className="text-red-600 hover:underline">Supprimer</button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Contractor tabs */}
        {activeTab === 'contractors' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Approbations en attente</h2>
            {pendingContractors.length === 0 ? (
              <p className="text-gray-600">Aucune demande en attente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left uppercase text-gray-600">
                      <th className="px-4 py-2">Nom</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Entreprise</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingContractors.map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.company_name || 'N/A'}</td>
                        <td className="px-4 py-2 space-x-2">
                          <form method="POST" action={`/admin/contractors/${c.id}/approve`} className="inline">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <button type="submit" className="text-green-600 hover:underline">Approuver</button>
                          </form>
                          <form method="POST" action={`/admin/contractors/${c.id}/reject`} className="inline">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <button type="submit" className="text-red-600 hover:underline">Rejeter</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h2 className="text-2xl font-semibold mt-10 mb-4">Contractants approuvés</h2>
            {approvedContractors.length === 0 ? (
              <p className="text-gray-600">Aucun contractant approuvé.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left uppercase text-gray-600">
                      <th className="px-4 py-2">Nom</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Entreprise</th>
                      <th className="px-4 py-2">Téléphone</th>
                      <th className="px-4 py-2">Rôle</th>
                      <th className="px-4 py-2">Créé le</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedContractors.map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.company_name || '—'}</td>
                        <td className="px-4 py-2">{c.phone || '—'}</td>
                        <td className="px-4 py-2">{c.role || '—'}</td>
                        <td className="px-4 py-2">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2">
                          <form method="POST" action={`/admin/contractors/${c.id}/delete`} onSubmit={(e) => { if (!confirm('Supprimer ce contractant ?')) e.preventDefault(); }}>
                            <input type="hidden" name="_token" value={csrf_token} />
                            <button type="submit" className="text-red-600 hover:underline">Supprimer</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SidebarContent({ navItems, isActive, csrf_token, onNavigate }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="px-6 py-4 text-xl font-bold border-b">Tableau d’administration</div>
        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`w-full flex justify-between items-center px-4 py-2 rounded block ${
                isActive(item.href) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              <span>{item.label}</span>
              {!!item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-4 py-4 border-t">
        <form method="POST" action="/admin/logout">
          <input type="hidden" name="_token" value={csrf_token} />
          <button className="w-full py-2 text-sm text-red-600 hover:underline">Se déconnecter</button>
        </form>
      </div>
    </div>
  );
}

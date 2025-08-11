import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function AdminDashboard() {
  const { pendingContractors = [], approvedContractors = [], csrf_token, users = [] } = usePage().props;
  const [activeTab, setActiveTab] = useState('parkx');

  const navItems = [
    { key: 'parkx', label: 'ParkX Accounts' },
    { key: 'contractors', label: 'Contractor Accounts', badge: pendingContractors.length },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Admin Dashboard</div>
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex justify-between items-center px-4 py-2 rounded text-left ${
                  activeTab === item.key ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-4 py-4 border-t">
          <form method="POST" action="/admin/logout">
            <input type="hidden" name="_token" value={csrf_token} />
            <button className="w-full py-2 text-sm text-red-600 hover:underline">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ParkX Account Management */}
        {activeTab === 'parkx' && (
          <>
            {/* Create user form */}
            <h2 className="text-2xl font-semibold mb-4">Create ParkX Account</h2>
            <form method="POST" action="/admin/users" className="space-y-4 bg-white p-6 rounded shadow max-w-md mb-8">
              <input type="hidden" name="_token" value={csrf_token} />
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" placeholder="Full Name" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" placeholder="Password" className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input type="password" name="password_confirmation" placeholder="Confirm Password" className="w-full px-4 py-2 border rounded" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create User
              </button>
            </form>

            {/* List of ParkX users */}
            <h3 className="text-xl font-semibold mb-3">All ParkX Accounts</h3>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">VODs à rendre</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-gray-600" colSpan={5}>No users found.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-t text-sm">
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">
                          <form method="POST" action={`/admin/users/${u.id}/update-quota`} className="flex items-center gap-2">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <input type="number" name="vods_quota" min="0" defaultValue={u.vods_quota ?? 0} className="w-20 px-2 py-1 border rounded" />
                            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                          </form>
                        </td>
                        <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <form method="POST" action={`/admin/users/${u.id}/delete`} onSubmit={(e) => { if (!confirm(`Delete ${u.name}?`)) e.preventDefault(); }}>
                            <input type="hidden" name="_token" value={csrf_token} />
                            <button type="submit" className="text-red-600 hover:underline">Delete</button>
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

        {/* Contractor Approvals */}
        {activeTab === 'contractors' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Pending Contractor Approvals</h2>
            {pendingContractors.length === 0 ? (
              <p className="text-gray-600">No pending contractor requests.</p>
            ) : (
              <table className="min-w-full bg-white shadow rounded mb-10">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingContractors.map((c) => (
                    <tr key={c.id} className="border-t text-sm">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.company_name || 'N/A'}</td>
                      <td className="px-4 py-2 space-x-2">
                        <form method="POST" action={`/admin/contractors/${c.id}/approve`} className="inline">
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-green-600 hover:underline">Approve</button>
                        </form>
                        <form method="POST" action={`/admin/contractors/${c.id}/reject`} className="inline">
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-red-600 hover:underline">Reject</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ✅ Approved Contractors */}
            <h2 className="text-2xl font-semibold mb-4">Approved Contractors</h2>
            {approvedContractors.length === 0 ? (
              <p className="text-gray-600">No approved contractors.</p>
            ) : (
              <table className="min-w-full bg-white shadow rounded">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedContractors.map((c) => (
                    <tr key={c.id} className="border-t text-sm">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.company_name || '—'}</td>
                      <td className="px-4 py-2">{c.phone || '—'}</td>
                      <td className="px-4 py-2">{c.role || '—'}</td>
                      <td className="px-4 py-2">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <form method="POST" action={`/admin/contractors/${c.id}/delete`} onSubmit={(e) => {
                          if (!confirm("Are you sure you want to delete this contractor?")) e.preventDefault();
                        }}>
                          <input type="hidden" name="_token" value={csrf_token} />
                          <button type="submit" className="text-red-600 hover:underline">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}

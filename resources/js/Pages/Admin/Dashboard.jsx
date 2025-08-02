import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function AdminDashboard() {
  const { pendingContractors = [], csrf_token } = usePage().props;
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
                  activeTab === item.key
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-100'
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
            <button className="w-full py-2 text-sm text-red-600 hover:underline">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ParkX Account Creation */}
        {activeTab === 'parkx' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Create ParkX Account</h2>
            <form method="POST" action="/admin/users" className="space-y-4 bg-white p-6 rounded shadow max-w-md">
              <input type="hidden" name="_token" value={csrf_token} />
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
  <label className="block text-sm font-medium mb-1">Confirm Password</label>
  <input
    type="password"
    name="password_confirmation"
    placeholder="Confirm Password"
    className="w-full px-4 py-2 border rounded"
    required
  />
</div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create User
              </button>
            </form>
          </>
        )}

        {/* Contractor Approvals */}
        {activeTab === 'contractors' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Pending Contractor Approvals</h2>
            {pendingContractors.length === 0 ? (
              <p className="text-gray-600">No pending contractor requests.</p>
            ) : (
              <table className="min-w-full bg-white shadow rounded">
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
          </>
        )}
      </main>
    </div>
  );
}

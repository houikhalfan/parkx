import React, { useState } from 'react';
import { UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend
    console.log('Creating user:', form);
    alert(`User "${form.name}" created!`);
    setForm({ name: '', email: '', role: 'user', password: '' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Manage Users</p>
        </div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-2 hover:text-blue-400">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-400">
            <UserPlus size={18} />
            Create Account
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-red-400">
            <LogOut size={18} />
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-10">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Create New Account</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-md"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

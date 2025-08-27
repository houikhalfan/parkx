import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from "@/Layouts/AdminLayout";

function AdminSignaturesIndex() {
  const { items = { data: [], links: [] }, q = '', s = '' } = usePage().props;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Signature Requests</h1>

      <form method="GET" className="mb-4 flex gap-2 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          className="w-full sm:w-80 px-3 py-2 border rounded"
          placeholder="Rechercher (titre ou contractant)…"
        />
        <select
          name="s"
          defaultValue={s}
          className="px-3 py-2 border rounded"
          title="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="signed">Signés</option>
          <option value="rejected">Rejetés</option>
        </select>
        <button className="px-3 py-2 rounded bg-blue-600 text-white">Filtrer</button>
      </form>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 px-4">Titre</th>
              <th className="py-2 px-4">Contractant</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Créé le</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.data.length === 0 && (
              <tr><td colSpan={5} className="py-4 px-4 text-gray-500">Aucun résultat.</td></tr>
            )}
            {items.data.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-2 px-4">{r.title}</td>
                <td className="py-2 px-4">
                  {r.contractor?.name}
                  <span className="text-gray-400"> ({r.contractor?.email})</span>
                </td>
                <td className="py-2 px-4"><StatusBadge s={r.status} /></td>
                <td className="py-2 px-4">{new Date(r.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <Link className="text-blue-600 hover:underline" href={route('admin.signatures.show', r.id)}>Ouvrir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 text-sm text-gray-600 flex flex-wrap gap-2">
        {items.links?.map((l, i) => (
          <Link
            key={i}
            href={l.url || '#'}
            className={`px-2 py-1 rounded ${l.active ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}
            dangerouslySetInnerHTML={{ __html: l.label }}
          />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    signed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-1 text-xs rounded ${map[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
}

AdminSignaturesIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminSignaturesIndex;

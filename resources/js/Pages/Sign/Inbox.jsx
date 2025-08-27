import React from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function Inbox() {
  const { items = [] } = usePage().props;
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Mes documents à signer</h1>
      <div className="bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Titre</th>
              <th className="px-3 py-2">Créé le</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map(x => (
              <tr key={x.id} className="border-t">
                <td className="px-3 py-2">{x.title}</td>
                <td className="px-3 py-2">{new Date(x.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right">
                  <Link className="text-blue-600 hover:underline" href={route('sign.inbox.form', x.id)}>Signer</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">Aucun document en attente.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

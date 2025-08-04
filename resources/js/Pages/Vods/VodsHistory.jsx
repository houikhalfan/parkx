import React from 'react';
import { usePage } from '@inertiajs/react';

export default function VodsHistory() {
  const { vods = [] } = usePage().props;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Historique des VODS</h2>

      {vods.length === 0 ? (
        <p className="text-gray-600">Aucun VODS rempli pour le moment.</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Projet</th>
              <th className="px-4 py-2">Activité</th>
              <th className="px-4 py-2">Entreprise</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vods.map((vod) => (
              <tr key={vod.id} className="border-t text-sm">
                <td className="px-4 py-2">{vod.date}</td>
                <td className="px-4 py-2">{vod.projet}</td>
                <td className="px-4 py-2">{vod.activite}</td>
                <td className="px-4 py-2">{vod.entrepriseObservee}</td>
                <td className="px-4 py-2">
                  <a href={`/vods/${vod.id}`} className="text-blue-500 hover:underline">
                    Voir détails
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import React from 'react';
import { usePage } from '@inertiajs/react';

export default function VodsHistory({ vods: vodsProp }) {
  const { vods: vodsFromPage = [] } = usePage().props || {};
  const vods = vodsProp ?? vodsFromPage; // prefer prop if provided

  const formatEntreprise = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(', ');
    try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr.join(', ') : String(val); }
    catch { return String(val); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Historique des VODS</h2>

      {(!vods || vods.length === 0) ? (
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
                <td className="px-4 py-2">{vod.date ? new Date(vod.date).toLocaleDateString('fr-FR') : ''}</td>
                <td className="px-4 py-2">{vod.projet}</td>
                <td className="px-4 py-2">{vod.activite}</td>
                <td className="px-4 py-2">{formatEntreprise(vod.entreprise_observee)}</td>
                <td className="px-4 py-2 space-x-3">
                  <a href={`/vods/${vod.id}/pdf`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Voir PDF</a>
                  <a href={`/vods/${vod.id}/pdf?download=1`} className="text-gray-700 hover:underline">Télécharger</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

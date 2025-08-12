import React, { useMemo, useState } from 'react';

export default function VodsHistory({ vods = [] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return vods;
    const s = q.toLowerCase();
    return vods.filter(v => {
      const date = (v.date || v.created_at || '').toString().toLowerCase();
      const projet = (v.projet || '').toString().toLowerCase();
      const activite = (v.activite || '').toString().toLowerCase();
      const obs = (v.observateur || v.observer || '').toString().toLowerCase();
      return date.includes(s) || projet.includes(s) || activite.includes(s) || obs.includes(s);
    });
  }, [q, vods]);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Historique des VODs</h2>
        <input
          className="input w-full sm:w-64"
          placeholder="Filtrer par date/projet/activité…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {filtered.length === 0 && <li className="text-sm text-gray-500">Aucun résultat.</li>}
        {filtered.map((v) => (
          <li key={v.id ?? `${v.date}-${v.projet}-${v.activite}-${Math.random()}`} className="p-3 rounded border">
            <div className="text-sm text-gray-500">{fmtDate(v.date || v.created_at)}</div>
            <div className="font-medium">{v.projet || 'Projet —'}</div>
            <div className="text-sm text-gray-600">{v.activite || 'Activité —'}</div>
            <div className="text-xs text-gray-500 mt-1">Obs: {v.observateur || '—'}</div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Projet</th>
              <th className="py-2 pr-4">Activité</th>
              <th className="py-2 pr-4">Observateur</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-gray-500">Aucun résultat.</td></tr>
            )}
            {filtered.map((v) => (
              <tr key={v.id ?? `${v.date}-${v.projet}-${v.activite}-${Math.random()}`} className="border-b last:border-0">
                <td className="py-2 pr-4">{fmtDate(v.date || v.created_at)}</td>
                <td className="py-2 pr-4">{v.projet || '—'}</td>
                <td className="py-2 pr-4">{v.activite || '—'}</td>
                <td className="py-2 pr-4">{v.observateur || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR');
  } catch {
    return d;
  }
}

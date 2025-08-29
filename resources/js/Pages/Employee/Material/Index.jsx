import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Pages/DashboardLayout';

export default function EmployeeMatIndex() {
  const { items = { data: [], links: [] }, q = '', s = '' } = usePage().props;

  return (
    <DashboardLayout title="Ressources matériel (assignées)">
      <form method="GET" className="mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="Recherche (site/contractant)…"
          className="rounded-lg border px-3 py-2 text-sm" />
        <select name="s" defaultValue={s} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="accepted">Accepté</option>
          <option value="rejected">Rejeté</option>
        </select>
        <button className="rounded-lg bg-black text-white px-3 py-2 text-sm">Filtrer</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Contractant</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Créé le</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.data.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">Aucun résultat.</td></tr>}
            {items.data.map(r=>(
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2">{r.site?.name}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.contractor?.name}</div>
                  <div className="text-xs text-gray-500">{r.contractor?.email}</div>
                </td>
                <td className="px-3 py-2">{label(r.status)}</td>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleString('fr-FR')}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={route('employee.materiel.show', r.id)} className="px-3 py-1.5 rounded bg-blue-50 text-blue-700">Ouvrir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
const label = s => s==='pending'?'En attente':s==='accepted'?'Accepté':'Rejeté';

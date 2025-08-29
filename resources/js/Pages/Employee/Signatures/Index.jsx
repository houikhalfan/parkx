// resources/js/Pages/Employee/Signatures/Index.jsx
import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Pages/DashboardLayout'; // ← adjust path if you placed it elsewhere

function EmployeeSignaturesIndex() {
  const { items = { data: [], links: [] }, q = '', s = '' } = usePage().props || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Papiers assignés</h1>
        <p className="text-sm text-gray-600 mt-1">
          Recherchez, filtrez et suivez les demandes qui vous sont assignées.
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-3.6-3.6" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            placeholder="Rechercher (titre ou contractant)…"
          />
        </div>

        <select
          name="s"
          defaultValue={s}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          title="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="signed">Signé</option>
          <option value="rejected">Rejeté</option>
        </select>

        <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
          Filtrer
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden border rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-500/90 border-b">
                <Th>Titre</Th>
                <Th>Contractant</Th>
                <Th>Statut</Th>
                <Th>Créé le</Th>
                <Th className="text-right pr-4">Action</Th>
              </tr>
            </thead>
            <tbody>
              {items.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucun résultat.</td>
                </tr>
              )}

              {items.data.map((r, idx) => (
                <tr key={r.id} className={`border-b last:border-0 ${idx % 2 ? 'bg-gray-50/40' : ''} hover:bg-gray-50`}>
                  <Td>{r.title}</Td>

                  <Td>
                    <div className="font-medium">{r.contractor?.name}</div>
                    <div className="text-xs text-gray-500">{r.contractor?.email}</div>
                  </Td>

                  <Td><StatusBadge s={r.status} /></Td>

                  <Td>
                    {new Date(r.created_at).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </Td>

                  <td className="py-3 pl-4 pr-4 text-right">
                    <Link
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                      href={route('employee.signatures.show', r.id)}
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {items.links?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 justify-end text-sm">
          {items.links.map((l, i) => (
            <Link
              key={i}
              href={l.url || '#'}
              className={[
                "rounded-md px-3 py-1.5",
                l.active ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              ].join(' ')}
              dangerouslySetInnerHTML={{ __html: localizePagination(l.label) }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* helpers */
function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
function StatusBadge({ s }) {
  const map = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente' },
    signed:  { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Signé' },
    rejected:{ bg: 'bg-rose-100', text: 'text-rose-700', label: 'Rejeté' },
  };
  const m = map[s] || { bg: 'bg-gray-100', text: 'text-gray-700', label: s || '—' };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${m.bg} ${m.text}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {m.label}
    </span>
  );
}
function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, 'Précédent')
    .replace(/Next|Next\s*&raquo;/gi, 'Suivant');
}

/* Inertia layout hook */
EmployeeSignaturesIndex.layout = (page) => (
  <DashboardLayout title="Papiers assignés">{page}</DashboardLayout>
);

export default EmployeeSignaturesIndex;

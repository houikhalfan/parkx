import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ContractantLayout from '@/Pages/ContractantLayout';

export default function SignatureIndex() {
  // NOTE: we now use `signed` (not `approved`) and `csrf_token`
  const { counts = {}, pending = [], signed = [], rejected = [], csrf_token } = usePage().props;
  const [openForm, setOpenForm] = useState(false);

  return (
    <ContractantLayout active="parapheur" title="Paraphe & Signature">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl md:text-2xl font-semibold">Paraphe & Signature</h1>
        <button
          onClick={() => setOpenForm(v => !v)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Déposer un document
        </button>
      </div>

      {/* Upload form */}
      {openForm && (
        <div className="mb-6 bg-white border rounded-xl shadow-sm p-4">
          <form
            method="POST"
            action={route('contractant.parapheur.store')}
            encType="multipart/form-data"
            className="grid gap-3 md:grid-cols-3"
          >
            <input type="hidden" name="_token" value={csrf_token} />
            <div className="md:col-span-1">
              <label className="text-sm text-gray-700 font-medium">Titre</label>
              <input
                name="title"
                required
                placeholder="Ex: Contrat lot 12"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm text-gray-700 font-medium">Fichier</label>
              <input name="file" type="file" required className="mt-1 w-full" />
              <p className="text-xs text-gray-500 mt-1">PDF, JPG/PNG, DOC/DOCX (max 10 Mo)</p>
            </div>
            <div className="md:col-span-1">
              <label className="text-sm text-gray-700 font-medium">Message (optionnel)</label>
              <input
                name="message"
                placeholder="Note à l’administration"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-3">
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                Envoyer
              </button>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="ml-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="En attente" value={counts.pending || 0} tone="blue" />
        <StatCard label="Signés" value={counts.signed || 0} tone="green" />
        <StatCard label="Rejetés" value={counts.rejected || 0} tone="red" />
      </div>

      {/* Lists */}
      <Section title="En attente (chez l’administration)">
        {pending.length === 0 ? <Empty>Aucune demande en attente.</Empty> : <List rows={pending} kind="pending" />}
      </Section>

      <Section title="Signés (téléchargements)">
        {signed.length === 0 ? <Empty>Aucun document signé pour le moment.</Empty> : <List rows={signed} kind="signed" />}
      </Section>

      <Section title="Rejetés">
        {rejected.length === 0 ? <Empty>Aucun document rejeté.</Empty> : <List rows={rejected} kind="rejected" />}
      </Section>
    </ContractantLayout>
  );
}

function StatCard({ label, value, tone = 'blue' }) {
  const color =
    tone === 'green' ? 'bg-green-100 text-green-700' :
    tone === 'red'   ? 'bg-red-100 text-red-700'   :
                       'bg-blue-100 text-blue-700';
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm mb-5">
      <div className="px-4 py-3 border-b font-semibold">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Empty({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

function List({ rows, kind }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2 pr-4">Titre</th>
            <th className="py-2 pr-4">Créé le</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="py-2 pr-4">{r.title || '—'}</td>
              <td className="py-2 pr-4">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
              <td className="py-2 pr-4 space-x-3">
                <a className="text-blue-600 hover:underline" href={route('contractant.parapheur.download.original', r.id)}>
                  Original
                </a>
                {kind === 'signed' && r.signed_path && (
                  <a className="text-green-600 hover:underline" href={route('contractant.parapheur.download.signed', r.id)}>
                    Signé
                  </a>
                )}
                <Link className="text-gray-600 hover:underline" href={route('contractant.parapheur.show', r.id)}>
                  Détails
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

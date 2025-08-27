import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from "@/Layouts/AdminLayout";

function AdminSignShow() {
  const { req, csrf_token, users = [] } = usePage().props;

  const approveForm = useForm({ signed_file: null, comment: '' });
  const rejectForm  = useForm({ reason: '' });
  const assignForm  = useForm({ user_id: '' });

  const approve = (e) => {
    e.preventDefault();
    approveForm.post(route('admin.signatures.approve', req.id), { forceFormData: true });
  };

  const reject = (e) => {
    e.preventDefault();
    rejectForm.post(route('admin.signatures.reject', req.id));
  };

  const assign = (e) => {
    e.preventDefault();
    assignForm.post(route('admin.signatures.assign', req.id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="rounded-2xl border bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{req.title}</h1>
              <StatusBadge s={req.status} />
            </div>

            {req.message && (
              <p className="mt-2 text-gray-700">{req.message}</p>
            )}

            <div className="mt-3 text-sm text-gray-600">
              Contractant&nbsp;:{" "}
              <span className="font-medium">{req.contractor?.name}</span>{" "}
              ({req.contractor?.email})
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {req.original_path && (
                <a
                  className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  href={route('admin.signatures.download.original', req.id)}
                >
                  Télécharger l’original
                </a>
              )}
              {req.signed_path && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                  Document signé
                </span>
              )}
            </div>
          </div>

          {/* Assign + Sign now */}
          <div className="shrink-0">
            <form onSubmit={assign} className="flex items-center gap-2">
              <select
                className="min-w-[260px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={assignForm.data.user_id}
                onChange={(e)=>assignForm.setData('user_id', e.target.value)}
                required
              >
                <option value="">Choisir un employé…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Assigner
              </button>
            </form>

            <div className="mt-2 text-right">
              <Link
                href={route('admin.signatures.sign.form', req.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                Signer maintenant (Admin)
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Approve (upload signed PDF) */}
            <form onSubmit={approve} className="rounded-xl border bg-white p-4">
              <h2 className="text-base font-semibold">Valider (joindre le document signé)</h2>
              <input type="hidden" name="_token" value={csrf_token} />

              <label className="mt-3 block text-sm font-medium text-gray-700">
                Fichier signé (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => approveForm.setData('signed_file', e.target.files?.[0] || null)}
                required
                className="mt-1 block w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {approveForm.errors.signed_file && (
                <p className="mt-1 text-sm text-red-600">{approveForm.errors.signed_file}</p>
              )}

              <label className="mt-4 block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Ajouter un commentaire…"
                rows={3}
                value={approveForm.data.comment}
                onChange={(e) => approveForm.setData('comment', e.target.value)}
              />

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Renvoyer signé
              </button>
            </form>

            {/* Reject */}
            <form onSubmit={reject} className="rounded-xl border bg-white p-4">
              <h2 className="text-base font-semibold">Refuser</h2>
              <input type="hidden" name="_token" value={csrf_token} />

              <label className="mt-3 block text-sm font-medium text-gray-700">
                Raison du refus
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Expliquez brièvement la raison…"
                rows={5}
                value={rejectForm.data.reason}
                onChange={(e) => rejectForm.setData('reason', e.target.value)}
                required
              />
              {rejectForm.errors.reason && (
                <p className="mt-1 text-sm text-red-600">{rejectForm.errors.reason}</p>
              )}

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Refuser
              </button>
            </form>
          </div>

          {/* Comments */}
          <section className="mt-8">
            <h2 className="text-base font-semibold">Commentaires</h2>

            {req.request_comments?.length ? (
              <ul className="mt-3 space-y-3">
                {req.request_comments.map((c) => (
                  <li key={c.id} className="rounded-xl border bg-gray-50 p-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          (c.author_type?.includes('Admin')) ? 'bg-gray-900' : 'bg-blue-600'
                        }`} />
                        {(c.author_type?.includes('Admin') ? 'Admin' : 'Contractant')}
                      </span>
                      <span>{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-800">{c.body}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Aucun commentaire.</p>
            )}
          </section>
        </div>
      </div>

      <div className="mt-4">
        <Link href={route('admin.signatures.index')} className="text-sm text-gray-600 hover:underline">
          ← Retour
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    submitted: 'bg-blue-50 text-blue-700 ring-blue-200',
    assigned:  'bg-amber-50 text-amber-700 ring-amber-200',
    signed:    'bg-green-50 text-green-700 ring-green-200',
    rejected:  'bg-red-50 text-red-700 ring-red-200',
    pending:   'bg-gray-100 text-gray-700 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${map[s] || 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
      {s}
    </span>
  );
}

AdminSignShow.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminSignShow;

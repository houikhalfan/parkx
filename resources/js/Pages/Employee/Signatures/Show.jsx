import React from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Pages/DashboardLayout';

export default function EmployeeSignShow() {
  const { req, csrf_token } = usePage().props;

  const approveForm = useForm({ signed_file: null, comment: '' });
  const rejectForm  = useForm({ reason: '' });

  const sweet = (title, text, icon='success') => {
    if (window.Swal) {
      return window.Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
    }
    alert(title + (text ? '\n' + text : ''));
    return Promise.resolve();
  };

  const approve = (e) => {
    e.preventDefault();
    approveForm.post(route('employee.signatures.approve', req.id), {
      forceFormData: true,
      onSuccess: async () => {
        await sweet('Document validé', 'Le contractant recevra la version signée.');
        router.visit(route('employee.signatures.index'));
      }
    });
  };

  const reject = (e) => {
    e.preventDefault();
    rejectForm.post(route('employee.signatures.reject', req.id), {
      onSuccess: async () => {
        await sweet('Demande refusée', 'Le contractant verra votre commentaire.');
        router.visit(route('employee.signatures.index'));
      }
    });
  };

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Demande de signature</h1>
        <p className="text-sm text-gray-600">Détail de la demande et actions du responsable.</p>
      </div>

      <div className="card-frame">
        <div className="flex items-start justify-between gap-6 border-b p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="truncate text-xl md:text-2xl font-semibold tracking-tight">{req.title}</h2>
              <StatusBadge s={req.status} />
            </div>

            {req.message && <p className="mt-2 text-gray-700">{req.message}</p>}

            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">Contractant</span>&nbsp;:&nbsp;
              <span className="font-medium">{req.contractor?.name}</span>{" "}
              <span className="text-gray-500">({req.contractor?.email})</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {req.original_path && (
                <a
                  className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  href={route('employee.signatures.download.original', req.id)}
                >
                  Télécharger l’original
                </a>
              )}
              {req.signed_path && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                  Document déjà renvoyé signé
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Valider */}
            <form onSubmit={approve} className="rounded-xl border bg-white p-4">
              <h3 className="text-base font-semibold">Valider (joindre le document signé)</h3>
              <input type="hidden" name="_token" value={csrf_token} />

              <label className="mt-3 block text-sm font-medium text-gray-700">Fichier signé (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => approveForm.setData('signed_file', e.target.files?.[0] || null)}
                required
                className="mt-1 block w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              {approveForm.errors.signed_file && (
                <p className="mt-1 text-sm text-red-600">{approveForm.errors.signed_file}</p>
              )}

              <label className="mt-4 block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Message pour le contractant…"
                rows={3}
                value={approveForm.data.comment}
                onChange={(e) => approveForm.setData('comment', e.target.value)}
              />

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Envoyer le document signé
              </button>
            </form>

            {/* Refuser */}
            <form onSubmit={reject} className="rounded-xl border bg-white p-4">
              <h3 className="text-base font-semibold">Refuser</h3>
              <input type="hidden" name="_token" value={csrf_token} />

              <label className="mt-3 block text-sm font-medium text-gray-700">Raison du refus</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
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

          {/* Historique des commentaires */}
          <section className="mt-8">
            <h3 className="text-base font-semibold">Commentaires</h3>

            {req.requestComments?.length ? (
              <ul className="mt-3 space-y-3">
                {req.requestComments.map((c) => (
                  <li key={c.id} className="rounded-xl border bg-gray-50 p-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            (c.author_type?.includes('User')) ? 'bg-blue-600' : 'bg-gray-900'
                          }`}
                        />
                        {(c.author_type?.includes('User') ? 'Responsable' : 'Contractant')}
                      </span>
                      <span>
                        {new Date(c.created_at).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
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
        <Link href={route('employee.signatures.index')} className="text-sm text-gray-600 hover:underline">
          ← Retour à la liste
        </Link>
      </div>

      <style>{`
        .card-frame {
          background-color: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    pending:  { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente' },
    signed:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Signé' },
    rejected: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Rejeté' },
  };
  const m = map[s] || { bg: 'bg-gray-100', text: 'text-gray-700', label: s || '—' };
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${m.bg} ${m.text}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />{m.label}
  </span>;
}

EmployeeSignShow.layout = (page) => <DashboardLayout title="Papiers assignés">{page}</DashboardLayout>;

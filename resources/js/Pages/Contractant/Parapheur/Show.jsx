import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

export default function ParapheurShow() {
  const { req, can_download_signed, csrf_token } = usePage().props;

  const form = useForm({ body: '' });
  const submit = (e) => {
    e.preventDefault();
    form.post(route('contractant.parapheur.comment', req.id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{req.title}</h1>
          <StatusBadge s={req.status} />
        </div>
        {req.message && <p className="mt-2 text-gray-700">{req.message}</p>}

        <div className="mt-4 flex gap-3 flex-wrap">
          <a className="text-blue-600 hover:underline" href={route('contractant.parapheur.download.original', req.id)}>
            Télécharger l’original
          </a>
          {can_download_signed && (
            <a className="text-green-700 hover:underline" href={route('contractant.parapheur.download.signed', req.id)}>
              Télécharger le signé
            </a>
          )}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Commentaires</h2>
          {req.request_comments?.length ? (
            <ul className="space-y-3">
              {req.request_comments.map((c) => (
                <li key={c.id} className="border rounded p-3">
                  <div className="text-sm text-gray-500 mb-1">
                    {(c.author_type?.includes('Admin') ? 'Admin' : 'Vous')} • {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div>{c.body}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Pas encore de commentaires.</p>
          )}

          <form onSubmit={submit} className="mt-4 space-y-2">
            <input type="hidden" name="_token" value={csrf_token} />
            <textarea
              className="input w-full"
              rows={3}
              placeholder="Votre message pour l’admin…"
              value={form.data.body}
              onChange={(e) => form.setData('body', e.target.value)}
              required
            />
            {form.errors.body && <p className="text-sm text-red-600">{form.errors.body}</p>}
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Envoyer
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <Link href={route('contractant.parapheur.index')} className="text-sm text-gray-600 hover:underline">
          ← Retour
        </Link>
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

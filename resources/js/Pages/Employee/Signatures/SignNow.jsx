import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Pages/DashboardLayout';

export default function SignNow() {
  const { req, csrf_token } = usePage().props;
  const form = useForm({ signed_file: null, comment: '' });

  const submit = (e) => {
    e.preventDefault();
    form.post(route('employee.signatures.sign.submit', req.id), { forceFormData: true });
  };

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Signer « {req.title} »</h1>

      <div className="card-frame p-6">
        <form onSubmit={submit} className="max-w-xl">
          <input type="hidden" name="_token" value={csrf_token} />

          <label className="block text-sm font-medium text-gray-700">Fichier signé (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => form.setData('signed_file', e.target.files?.[0] || null)}
            required
            className="mt-1 mb-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <label className="block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
          <textarea
            rows={3}
            className="mt-1 mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={form.data.comment}
            onChange={(e) => form.setData('comment', e.target.value)}
          />

          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Envoyer
          </button>
          <Link href={route('employee.signatures.show', req.id)} className="ml-3 text-sm text-gray-600 hover:underline">
            Annuler
          </Link>
        </form>
      </div>

      <style>{`
        .card-frame {
          background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:20px;
          box-shadow:0 1px 0 rgba(0,0,0,.04),0 8px 24px -12px rgba(0,0,0,.18);
        }
      `}</style>
    </div>
  );
}
SignNow.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;

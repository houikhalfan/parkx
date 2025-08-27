import React, { useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function EmployeeSign() {
  const { req } = usePage().props;
  const fileRef = useRef(null);
  const form = useForm({ signed_pdf: null });

  const submit = (e) => {
    e.preventDefault();
    form.post(route('sign.inbox.submit', req.id), { forceFormData: true });
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-semibold">Signer : {req.title}</h1>
      <p className="text-sm text-gray-600 mt-1">Téléversez le PDF signé. L’original sera supprimé.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input type="file" ref={fileRef} accept="application/pdf"
               onChange={(e)=>form.setData('signed_pdf', e.target.files?.[0] || null)} required />
        {form.errors.signed_pdf && <p className="text-red-600 text-sm">{form.errors.signed_pdf}</p>}
        <button className="px-4 py-2 rounded bg-green-600 text-white">Envoyer le PDF signé</button>
      </form>
    </div>
  );
}

import React from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Pages/DashboardLayout';
import Swal from 'sweetalert2';

export default function EmployeeMatShow() {
  const { req, csrf_token } = usePage().props;

  const acceptForm = useForm({ comment: '' });
  const rejectForm = useForm({ reason: '' });

  const accept = (e) => {
    e.preventDefault();
    acceptForm.post(route('employee.materiel.accept', req.id), {
      onSuccess: () => {
        Swal.fire({ icon:'success', title:'Demande acceptée', timer:1200, showConfirmButton:false })
          .then(()=> router.visit(route('employee.materiel.index')));
      }
    });
  };

  const reject = (e) => {
    e.preventDefault();
    rejectForm.post(route('employee.materiel.reject', req.id), {
      onSuccess: () => {
        Swal.fire({ icon:'success', title:'Demande rejetée', timer:1200, showConfirmButton:false })
          .then(()=> router.visit(route('employee.materiel.index')));
      }
    });
  };

  return (
    <DashboardLayout title="Détail - Ressources matériel">
      <div className="mb-4">
        <div className="text-sm text-gray-500">
          Contractant : <span className="font-medium">{req.contractor?.name}</span> ({req.contractor?.email}) &nbsp;•&nbsp;
          Site : <span className="font-medium">{req.site?.name}</span>
        </div>
        <div className="text-xs text-gray-500">Créé le {new Date(req.created_at).toLocaleString('fr-FR')}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FileRow label="Contrôle réglementaire" href={route('employee.materiel.download',[req.id,'controle'])} />
        <FileRow label="Assurance" href={route('employee.materiel.download',[req.id,'assurance'])} />
        <FileRow label="Habilitation du conducteur" href={route('employee.materiel.download',[req.id,'habilitation'])} />
        <FileRow label="Rapports de chantier et conformité" href={route('employee.materiel.download',[req.id,'rapports'])} />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={accept} className="rounded-xl border p-4 bg-white">
          <h3 className="font-semibold">Valider</h3>
          <input type="hidden" name="_token" value={csrf_token}/>
          <label className="block text-sm mt-3">Commentaire (optionnel)</label>
          <textarea className="w-full rounded border px-3 py-2 text-sm" rows={4}
            value={acceptForm.data.comment}
            onChange={e=>acceptForm.setData('comment', e.target.value)} />
          <button className="mt-3 rounded bg-emerald-600 text-white px-4 py-2 text-sm">Accepter</button>
        </form>

        <form onSubmit={reject} className="rounded-xl border p-4 bg-white">
          <h3 className="font-semibold">Refuser</h3>
          <input type="hidden" name="_token" value={csrf_token}/>
          <label className="block text-sm mt-3">Raison du refus</label>
          <textarea className="w-full rounded border px-3 py-2 text-sm" rows={5} required
            value={rejectForm.data.reason}
            onChange={e=>rejectForm.setData('reason', e.target.value)} />
          <button className="mt-3 rounded bg-rose-600 text-white px-4 py-2 text-sm">Refuser</button>
        </form>
      </div>

      <div className="mt-4">
        <Link href={route('employee.materiel.index')} className="text-sm text-gray-600 hover:underline">← Retour</Link>
      </div>
    </DashboardLayout>
  );
}
const FileRow = ({label, href}) => (
  <a href={href} className="rounded-lg border p-3 bg-white hover:bg-gray-50 inline-flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <span className="text-xs text-blue-700">Télécharger</span>
  </a>
);

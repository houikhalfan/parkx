import React, { useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';

export default function QrResult() {
  const { conforme, site, contractor, at, autoPrint, decided_at } = usePage().props;

  // the URL encoded inside the QR should be this page URL *without* ?print=1
  const verifyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.delete('print');
    return url.toString();
  }, []);

  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 100);
      return () => clearTimeout(t);
    }
  }, [autoPrint]);

  const headline = conforme ? 'Conforme' : 'Non conforme';
  const message  = conforme
    ? 'Cet engin est conforme par l’administration.'
    : 'Cet engin n’est pas reconnu comme conforme par l’administration.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="print-card max-w-lg w-full rounded-2xl border bg-white p-8 text-center shadow">
        {/* QR to this very page (so scans always land here) */}
        <img
          alt="QR de vérification"
          className="mx-auto mb-4 h-60 w-60"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`}
        />

        <div className={`text-3xl font-extrabold ${conforme ? 'text-emerald-600' : 'text-rose-600'}`}>
          {headline}
        </div>

        <p className="mt-2 text-base">
          {message}
        </p>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          {site && <div><span className="font-semibold">Site : </span>{site}</div>}
          {contractor && <div><span className="font-semibold">Contractant : </span>{contractor}</div>}
          {decided_at && <div><span className="font-semibold">Décision : </span>{new Date(decided_at).toLocaleString('fr-FR')}</div>}
          <div className="text-gray-500">Vérifié le {new Date(at).toLocaleString('fr-FR')}</div>
        </div>

        {/* Buttons hidden when printing */}
        <div className="noprint mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Imprimer
          </button>
          <a
            href={verifyUrl}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            target="_blank" rel="noreferrer"
          >
            Ouvrir dans un onglet
          </a>
        </div>
      </div>

      {/* Print styles: keep only the card, remove shadows/margins */}
      <style>{`
        @media print {
          .noprint { display: none !important; }
          body { background: #fff !important; }
          .print-card {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

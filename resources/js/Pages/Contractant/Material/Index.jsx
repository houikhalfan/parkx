import React, { useMemo, useState, useEffect } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import ContractantLayout from "@/Pages/ContractantLayout";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  FileText,
} from "lucide-react";

export default function MaterialIndex() {
  const {
    pending = [],
    accepted = [],
    rejected = [],
    sites = [],
    csrf_token,
    swal, // flash: { type, text }
  } = usePage().props || {};

  // SweetAlert from server flash
  useEffect(() => {
    if (!swal) return;
    if (window?.Swal?.fire) {
      window.Swal.fire({
        icon: swal.type || "info",
        title: swal.type === "success" ? "Succès" : swal.type === "error" ? "Erreur" : "Info",
        text: swal.text || "",
        confirmButtonText: "OK",
      });
    } else {
      alert(swal.text || "Opération effectuée");
    }
  }, [swal]);

  const [showUpload, setShowUpload] = useState(false);
  const [active, setActive] = useState("pending"); // 'pending' | 'accepted' | 'rejected'
  const [q, setQ] = useState("");

  // live counts from arrays
  const countsSafe = {
    pending: Array.isArray(pending) ? pending.length : 0,
    accepted: Array.isArray(accepted) ? accepted.length : 0,
    rejected: Array.isArray(rejected) ? rejected.length : 0,
  };

  const source = active === "pending" ? pending : active === "accepted" ? accepted : rejected;

  // search only by site name (no title/message in DB)
  const filtered = useMemo(() => {
    if (!q.trim()) return source;
    const k = q.toLowerCase();
    return source.filter((r) => (r.site?.name || "").toLowerCase().includes(k));
  }, [source, q]);

  return (
    <ContractantLayout active="material" title="Ressources matériel">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500">Espace &gt; Ressources &gt; Ressources matériel</div>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ressources matériel</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Segmented active={active} onChange={setActive} counts={countsSafe} />
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (site)…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <SummaryCard icon={<Clock className="w-4 h-4" />} label="En attente" value={countsSafe.pending} />
        <SummaryCard icon={<CheckCircle2 className="w-4 h-4" />} label="Acceptées" value={countsSafe.accepted} />
        <SummaryCard icon={<XCircle className="w-4 h-4" />} label="Refusées" value={countsSafe.rejected} />
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl">
        {filtered.length === 0 ? (
          <EmptyState
            title={
              active === "pending"
                ? "Aucune demande en attente"
                : active === "accepted"
                ? "Aucune demande acceptée"
                : "Aucune demande refusée"
            }
            hint={q ? `Aucun résultat pour « ${q} »` : "Les éléments apparaîtront ici."}
          />
        ) : (
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <Card key={r.id} row={r} kind={active} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          csrf_token={csrf_token}
          sites={sites}
          onClose={() => setShowUpload(false)}
        />
      )}
    </ContractantLayout>
  );
}

/* ----------------------------- Subcomponents ----------------------------- */

function Segmented({ active, onChange, counts }) {
  const base = "text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition focus:outline-none";
  const activeCls = "bg-blue-600 text-white border-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500";
  const normal = "bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400";

  return (
    <div className="inline-flex gap-2">
      <button className={`${base} ${active === "pending" ? activeCls : normal}`} onClick={() => onChange("pending")} type="button">
        <Clock className="w-4 h-4" />
        <span className="font-medium">En attente</span>
        <Badge tone={active === "pending" ? "white" : "blue"}>{counts.pending}</Badge>
      </button>
      <button className={`${base} ${active === "accepted" ? activeCls : normal}`} onClick={() => onChange("accepted")} type="button">
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium">Acceptées</span>
        <Badge tone={active === "accepted" ? "white" : "green"}>{counts.accepted}</Badge>
      </button>
      <button className={`${base} ${active === "rejected" ? activeCls : normal}`} onClick={() => onChange("rejected")} type="button">
        <XCircle className="w-4 h-4" />
        <span className="font-medium">Refusées</span>
        <Badge tone={active === "rejected" ? "white" : "red"}>{counts.rejected}</Badge>
      </button>
    </div>
  );
}

function Badge({ children, tone = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    white: "bg-white/20 text-white",
  };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${map[tone] || map.gray}`}>{children}</span>;
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="border rounded-xl bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="p-1.5 rounded-md bg-gray-100">{icon}</span>
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="text-base font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{hint}</div>
    </div>
  );
}

function StatusBadge({ kind }) {
  const map = {
    pending: { text: "En attente", cls: "bg-blue-50 text-blue-700" },
    accepted: { text: "Acceptée", cls: "bg-green-50 text-green-700" },
    rejected: { text: "Refusée", cls: "bg-red-50 text-red-700" },
  };
  const { text, cls } = map[kind] || map.pending;
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{text}</span>;
}

function Card({ row, kind }) {
  const pngUrl = row.qr_png_url || (row.qrcode_path ? `/storage/${row.qrcode_path}` : null);
  const qrText = row.qr_text || row.qrcode_text || "Cet engin est conforme par l’administration.";

  return (
    <div className="border rounded-xl bg-white p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-gray-900 truncate">
            {/* no title in DB, show site or fallback */}
            {row.site?.name ? `Site : ${row.site.name}` : `Demande #${row.id}`}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Créé le {formatDate(row.created_at)}</div>

          {row.last_decision_comment && (
            <p className="mt-2 text-xs text-gray-700">
              <span className="font-medium">
                Commentaire du responsable
                {kind === "rejected" ? " (refus)" : ""}
                {kind === "accepted" ? " (validation)" : ""} :
              </span>{" "}
              {row.last_decision_comment}
            </p>
          )}
        </div>
        <StatusBadge kind={kind} />
      </div>

      {/* Accepted: QR block */}
      {kind === "accepted" && pngUrl && (
        <div className="mt-4 border-t pt-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <QrCode className="w-4 h-4" /> QR “Conforme”
          </div>

          <img alt="QR conforme" className="h-48 w-48" src={pngUrl} />

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => printQR(pngUrl, row.site?.name || `Demande #${row.id}`, qrText)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
              title="Imprimer uniquement le QR"
            >
              <FileText className="w-4 h-4" />
              Imprimer le QR
            </button>

            {qrText && (
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(qrText)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                title="Copier le contenu encodé dans le QR"
              >
                Copier le message
              </button>
            )}
          </div>

          {qrText && <div className="text-xs text-gray-500 mt-2 whitespace-pre-line">{qrText}</div>}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Upload Modal ----------------------------- */

function UploadModal({ csrf_token, sites = [], onClose }) {
  const { post, processing, errors, setData, data, reset } = useForm({
    site_id: "",
    // 4 files
    controle_reglementaire: null,
    assurance: null,
    habilitation_conducteur: null,
    rapports_conformite: null, // ← align with DB/controller
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("contractant.materiel.store"), { // ← correct route name
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        // refresh lists so the new row appears without manual reload
        if (window?.Swal?.fire) {
          window.Swal.fire({ icon: "success", title: "Envoyé", text: "Votre demande a été transmise." })
            .then(() => {
              // refresh only needed props
              window.Inertia?.reload?.({ only: ["pending","accepted","rejected","counts"] });
              onClose();
            });
        } else {
          window.Inertia?.reload?.({ only: ["pending","accepted","rejected","counts"] });
          onClose();
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-50 w-full max-w-3xl bg-white border rounded-xl shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-semibold text-gray-900">Nouvelle demande — Ressources matériel</div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600" aria-label="Fermer">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="_token" value={csrf_token} />

          <div>
            <label className="text-sm text-gray-700 font-medium">Site *</label>
            <select
              required
              value={data.site_id}
              onChange={(e) => setData("site_id", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Choisir un site…</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.site_id && <div className="text-red-600 text-xs mt-1">{errors.site_id}</div>}
          </div>

          {/* Files */}
          <FileField
            label="Contrôle réglementaire *"
            onChange={(f) => setData("controle_reglementaire", f)}
            error={errors.controle_reglementaire}
          />
          <FileField
            label="Assurance *"
            onChange={(f) => setData("assurance", f)}
            error={errors.assurance}
          />
          <FileField
            label="Habilitation du conducteur *"
            onChange={(f) => setData("habilitation_conducteur", f)}
            error={errors.habilitation_conducteur}
          />
          <FileField
            label="Rapports de chantier et conformité *"
            onChange={(f) => setData("rapports_conformite", f)}   // ← align
            error={errors.rapports_conformite}
          />

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={processing} className="px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {processing ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileField({ label, onChange, error }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <input
        type="file"
        required
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="mt-1 w-full text-sm"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
      <p className="text-xs text-gray-500 mt-1">PDF, JPG/PNG, DOC/DOCX (max 10 Mo)</p>
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
  );
}

/* ----------------------------- helpers ----------------------------- */

function printQR(url, title, text) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=420,height=600");
  if (!w) return;
  const safeTitle = (title || "QR de conformité").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeText = (text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  w.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 16px; }
  .wrap { text-align: center; }
  img { width: 320px; height: 320px; image-rendering: pixelated; }
  h1 { font-size: 16px; margin: 8px 0 12px; }
  .hint { font-size: 12px; color: #444; margin-top: 8px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <div class="wrap">
    <h1>${safeTitle}</h1>
    <img src="${url}" alt="QR conforme">
    ${safeText ? `<div class="hint">${safeText}</div>` : ``}
  </div>
  <script>
    window.addEventListener('load', function(){ setTimeout(function(){ window.print(); window.close(); }, 150); });
  </script>
</body>
</html>`);
  w.document.close();
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

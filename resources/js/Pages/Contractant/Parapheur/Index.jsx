import React, { useMemo, useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import ContractantLayout from "@/Pages/ContractantLayout";
import { Plus, Search, X, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function SignatureIndex() {
  const {
    counts = {},
    pending = [],
    signed = [],
    rejected = [],
    csrf_token,
    sites = [], // list of {id,name}
  } = usePage().props;

  const [showUpload, setShowUpload] = useState(false);
  const [active, setActive] = useState("pending");
  const [q, setQ] = useState("");

  const [data, setData] = useState({
    pending: Array.isArray(pending) ? pending : [],
    signed: Array.isArray(signed) ? signed : [],
    rejected: Array.isArray(rejected) ? rejected : [],
  });

  useEffect(() => {
    setData({
      pending: Array.isArray(pending) ? pending : [],
      signed: Array.isArray(signed) ? signed : [],
      rejected: Array.isArray(rejected) ? rejected : [],
    });
  }, [pending, signed, rejected]);

  const countsSafe = {
    pending: data.pending.length,
    signed: data.signed.length,
    rejected: data.rejected.length,
  };

  const source =
    active === "pending" ? data.pending : active === "signed" ? data.signed : data.rejected;

  const filtered = useMemo(() => {
    if (!q.trim()) return source;
    const k = q.toLowerCase();
    return source.filter(
      (r) =>
        (r.title || "").toLowerCase().includes(k) ||
        (r.message || "").toLowerCase().includes(k)
    );
  }, [source, q]);

  const handleCreatedOptimistic = ({ title, message }) => {
    const temp = {
      id: `temp-${Date.now()}`,
      title: title || "—",
      message: message || "",
      created_at: new Date().toISOString(),
      status: "pending",
      signed_path: null,
    };
    setData((prev) => ({ ...prev, pending: [temp, ...prev.pending] }));
    setActive("pending");
  };

  return (
    <ContractantLayout active="parapheur" title="Paraphe & Signature">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500">Espace &gt; Documents &gt; Paraphe & Signature</div>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paraphe & Signature</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
            Déposer un document
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
            placeholder="Rechercher un document…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <SummaryCard icon={<Clock className="w-4 h-4" />} label="En attente" value={countsSafe.pending} />
        <SummaryCard icon={<CheckCircle2 className="w-4 h-4" />} label="Signés" value={countsSafe.signed} />
        <SummaryCard icon={<XCircle className="w-4 h-4" />} label="Rejetés" value={countsSafe.rejected} />
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl">
        {filtered.length === 0 ? (
          <EmptyState
            title={
              active === "pending"
                ? "Aucune demande en attente"
                : active === "signed"
                ? "Aucun document signé"
                : "Aucun document rejeté"
            }
            hint={q ? `Aucun résultat pour « ${q} »` : "Les éléments apparaîtront ici."}
          />
        ) : (
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <DocCard key={r.id} row={r} kind={active} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          csrf_token={csrf_token}
          sites={sites}
          onClose={() => setShowUpload(false)}
          onCreatedOptimistic={handleCreatedOptimistic}
        />
      )}
    </ContractantLayout>
  );
}

/* ---------- subcomponents ---------- */

function Segmented({ active, onChange, counts }) {
  const base =
    "text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition focus:outline-none";
  const activeCls =
    "bg-blue-600 text-white border-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500";
  const normal =
    "bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400";

  return (
    <div className="inline-flex gap-2">
      <button className={`${base} ${active === "pending" ? activeCls : normal}`} onClick={() => onChange("pending")} type="button">
        <Clock className="w-4 h-4" />
        <span className="font-medium">En attente</span>
        <Badge tone={active === "pending" ? "white" : "blue"}>{counts.pending}</Badge>
      </button>
      <button className={`${base} ${active === "signed" ? activeCls : normal}`} onClick={() => onChange("signed")} type="button">
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium">Signés</span>
        <Badge tone={active === "signed" ? "white" : "green"}>{counts.signed}</Badge>
      </button>
      <button className={`${base} ${active === "rejected" ? activeCls : normal}`} onClick={() => onChange("rejected")} type="button">
        <XCircle className="w-4 h-4" />
        <span className="font-medium">Rejetés</span>
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
    signed: { text: "Signé", cls: "bg-green-50 text-green-700" },
    rejected: { text: "Rejeté", cls: "bg-red-50 text-red-700" },
  };
  const { text, cls } = map[kind] || map.pending;
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{text}</span>;
}

function DocCard({ row, kind }) {
  return (
    <div className="border rounded-xl bg-white p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-gray-900 truncate">
            {row.title || "—"}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Créé le {formatDate(row.created_at)}
          </div>
          {row.site?.name && (
            <div className="text-xs text-gray-600 mt-1">
              <span className="font-medium">Site :</span> {row.site.name}
            </div>
          )}
          {/* decision comment from responsible */}
          {row.last_decision_comment && (
            <p className="mt-2 text-xs text-gray-700">
              <span className="font-medium">
                Commentaire du responsable
                {kind === "rejected" ? " (refus)" : ""}
                {kind === "signed" ? " (validation)" : ""} :
              </span>{" "}
              {row.last_decision_comment}
            </p>
          )}
        </div>
        <StatusBadge kind={kind} />
      </div>

      {row.message && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{row.message}</p>
      )}

      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        <ActionLink href={route("contractant.parapheur.download.original", row.id)} label="Original" />
        {kind === "signed" && row.signed_path && (
          <ActionLink href={route("contractant.parapheur.download.signed", row.id)} label="Signé" />
        )}
      </div>
    </div>
  );
}

function ActionLink({ href, label }) {
  return (
    <a href={href} className="text-sm px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
      {label}
    </a>
  );
}

/* ------------ Upload Modal (fixed placeholder) ------------ */
function UploadModal({ csrf_token, sites = [], onClose, onCreatedOptimistic }) {
  const form = useForm({
    title: "",
    file: null,
    message: "",
    site_id: "", // controlled + required
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreatedOptimistic({
      title: form.data.title,
      message: form.data.message,
    });

    form.post(route("contractant.parapheur.store"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl bg-white border rounded-xl shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-semibold text-gray-900">Déposer un document</div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="_token" value={csrf_token} />

          <div>
            <label className="text-sm text-gray-700 font-medium">Titre</label>
            <input
              name="title"
              value={form.data.title}
              onChange={(e) => form.setData("title", e.target.value)}
              required
              placeholder="Ex: Contrat lot 12"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.errors.title && <div className="text-red-600 text-xs mt-1">{form.errors.title}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Fichier</label>
            <input
              name="file"
              type="file"
              required
              onChange={(e) => form.setData("file", e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">PDF, JPG/PNG, DOC/DOCX (max 10 Mo)</p>
            {form.errors.file && <div className="text-red-600 text-xs mt-1">{form.errors.file}</div>}
          </div>

          {/* Site (placeholder hidden in the dropdown) */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Site <span className="text-red-600">*</span>
            </label>
            <select
              name="site_id"
              required
              value={form.data.site_id}
              onChange={(e) => form.setData("site_id", e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!form.errors.site_id}
            >
              {/* The key fix: disabled + hidden so it does not appear in the open list */}
              <option value="" disabled hidden>Choisir un site…</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {form.errors.site_id && <div className="text-red-600 text-xs mt-1">{form.errors.site_id}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-700 font-medium">Message (optionnel)</label>
            <input
              name="message"
              value={form.data.message}
              onChange={(e) => form.setData("message", e.target.value)}
              placeholder="Note à l’administration"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.errors.message && <div className="text-red-600 text-xs mt-1">{form.errors.message}</div>}
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {form.processing ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

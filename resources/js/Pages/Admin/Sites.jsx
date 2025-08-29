import React, { useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";

export default function SitesPage() {
  const { users = [], sites = [], csrf_token, flash = {} } = usePage().props || {};

  // --- keep editable copy of the list
  const [rows, setRows] = useState(mapSitesToRows(sites));
  // 🔁 auto-resync when server sends new props
  useEffect(() => {
    setRows(mapSitesToRows(sites));
  }, [sites]);

  // SweetAlert for server flashes
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({ icon: "success", title: flash.success, timer: 1600, showConfirmButton: false });
    } else if (flash?.error) {
      Swal.fire({ icon: "error", title: flash.error });
    }
  }, [flash]);

  // create form
  const [createForm, setCreateForm] = useState({ name: "", responsible_user_id: "" });

  const submitCreate = (e) => {
    e.preventDefault();
    router.post(
      route("admin.sites.store"),
      {
        name: createForm.name,
        responsible_user_id: createForm.responsible_user_id || null,
      },
      {
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
          setCreateForm({ name: "", responsible_user_id: "" });
          // 🔁 get the latest list only
          router.reload({ only: ["sites"] });
          Swal.fire({ icon: "success", title: "Site créé", timer: 1200, showConfirmButton: false });
        },
        onError: (errors) => {
          Swal.fire({ icon: "error", title: "Création échouée", text: Object.values(errors).join("\n") });
        },
      }
    );
  };

  const submitUpdate = (row) => {
    router.post(
      route("admin.sites.update", row.id),
      {
        _token: csrf_token,
        name: row.name,
        responsible_user_id: row.responsible_user_id || null,
      },
      {
        preserveScroll: true,
        replace: true,
        onSuccess: () => {
          // 🔁 refresh just the list
          router.reload({ only: ["sites"] });
          Swal.fire({ icon: "success", title: "Site mis à jour", timer: 1200, showConfirmButton: false });
        },
        onError: (errors) => {
          Swal.fire({ icon: "error", title: "Mise à jour échouée", text: Object.values(errors).join("\n") });
        },
      }
    );
  };

  const submitDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Supprimer ce site ?",
      text: "Cette action est irréversible.",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((res) => {
      if (!res.isConfirmed) return;

      router.post(
        route("admin.sites.delete", id),
        { _token: csrf_token },
        {
          preserveScroll: true,
          replace: true,
          onSuccess: () => {
            // 🔁 refresh just the list
            router.reload({ only: ["sites"] });
            Swal.fire({ icon: "success", title: "Site supprimé", timer: 1200, showConfirmButton: false });
          },
          onError: () => Swal.fire({ icon: "error", title: "Impossible de supprimer le site" }),
        }
      );
    });
  };

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sites</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Gérer la liste des sites et leur responsable.
        </p>
      </div>

      {/* Create */}
      <div className="rounded-2xl border p-4 mb-6">
        <form onSubmit={submitCreate} className="grid md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du site</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Ex: Bengurir"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Responsable (optionnel)</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={createForm.responsible_user_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, responsible_user_id: e.target.value }))}
            >
              <option value="">— Aucun —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="w-full md:w-auto inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
              Ajouter le site
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card-frame overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-500/90 border-b">
                <Th>Nom</Th>
                <Th>Responsable</Th>
                <Th>Employés</Th>
                <Th className="text-right pr-4">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Aucun site.
                  </td>
                </tr>
              )}

              {rows.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`border-b last:border-0 ${idx % 2 ? "bg-gray-50/40" : ""}`}
                >
                  <Td>
                    <input
                      className="w-full rounded-lg border px-3 py-1.5"
                      value={r.name}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <select
                      className="w-full rounded-lg border px-3 py-1.5"
                      value={r.responsible_user_id}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id ? { ...x, responsible_user_id: e.target.value } : x
                          )
                        )
                      }
                    >
                      <option value="">— Aucun —</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td>{r.employees_count}</Td>
                  <td className="py-3 pl-4 pr-4 text-right space-x-2">
                    <button
                      onClick={() => submitUpdate(r)}
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mettre à jour
                    </button>
                    <button
                      onClick={() => submitDelete(r.id)}
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium bg-rose-100 text-rose-700 hover:bg-rose-200"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

function mapSitesToRows(sites) {
  return (sites || []).map((s) => ({
    id: s.id,
    name: s.name,
    responsible_user_id: s.manager?.id || "",
    employees_count: s.employees_count || 0,
  }));
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

SitesPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;

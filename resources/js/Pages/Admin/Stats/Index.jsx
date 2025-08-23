// resources/js/Pages/Admin/Stats/Index.jsx
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function StatsIndex({ reports }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Rapports Statistiques (Contractants)</h1>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Contractant</th>
              <th className="px-3 py-2 text-left">TRIR</th>
              <th className="px-3 py-2 text-left">LTIR</th>
              <th className="px-3 py-2 text-left">DART</th>
              <th className="px-3 py-2 text-left">Heures</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">PDF</th>
            </tr>
          </thead>
          <tbody>
            {reports.data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">
                  {r.contractor?.name} <span className="text-gray-500">({r.contractor?.email})</span>
                </td>
                <td className="px-3 py-2">{r.trir ?? "-"}</td>
                <td className="px-3 py-2">{r.ltir ?? "-"}</td>
                <td className="px-3 py-2">{r.dart ?? "-"}</td>
                <td className="px-3 py-2">{r.total_hours}</td>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-3 py-2">
                  {r.pdf_path ? (
                    <a className="text-blue-600 hover:underline" href={route("admin.stats.pdf", r.id)}>
                      Télécharger
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* simple pager */}
      <div className="mt-3 text-sm text-gray-600">
        Page {reports.current_page} / {reports.last_page}
      </div>
    </div>
  );
}

StatsIndex.layout = (page) => <AdminLayout children={page} />;
export default StatsIndex;

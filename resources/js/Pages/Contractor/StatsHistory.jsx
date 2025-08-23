import React from "react";
import { Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function StatsHistory({ reports }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Historique des statistiques</h1>
        <Link href="/contractor/stats/new" className="text-indigo-600 hover:underline">Nouvelle soumission</Link>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        {reports.data.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun rapport.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Heures</th>
                <th className="py-2">TRIR</th>
                <th className="py-2">LTIR</th>
                <th className="py-2">DART</th>
              </tr>
            </thead>
            <tbody>
              {reports.data.map(r => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2">{r.date}</td>
                  <td className="py-2">{r.totalHours}</td>
                  <td className="py-2">{Number(r.trir).toFixed(2)}</td>
                  <td className="py-2">{Number(r.ltir).toFixed(2)}</td>
                  <td className="py-2">{Number(r.dart).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

StatsHistory.layout = (page) => <DashboardLayout children={page} />;

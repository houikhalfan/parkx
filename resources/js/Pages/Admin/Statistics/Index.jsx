import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Utility function to format dates (for admin list - shows only date)
const formatDateOnly = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return 'Date invalide';
  }
};

// Utility function to format full timestamps (for admin details - shows date + time)
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Date invalide';
  }
};

function AdminStatisticsIndex({ statistics }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name"); // "name", "date", or "site"
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter statistics based on search
  const filteredStatistics = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return statistics;
    }

    const filtered = {
      ...statistics,
      data: statistics.data.filter((stat) => {
        const term = debouncedSearchTerm.toLowerCase();
        
        if (searchBy === "name") {
          const contractorName = stat.contractor?.name || stat.contractor?.company_name || '';
          return contractorName.toLowerCase().includes(term);
        } else if (searchBy === "date") {
          // Search by date - convert both to comparable format
          const statDate = stat.date ? new Date(stat.date).toISOString().split('T')[0] : '';
          return statDate.includes(debouncedSearchTerm);
        } else if (searchBy === "site") {
          return stat.site?.toLowerCase().includes(term);
        }
        
        return true;
      })
    };

    return filtered;
  }, [statistics, debouncedSearchTerm, searchBy]);
  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques HSE Contractors</h1>
          <p className="text-gray-600">Statistiques soumises par les entrepreneurs</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={route('admin.home')}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau d'administration
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Rechercher par {searchBy === "name" ? "nom d'utilisateur" : searchBy === "date" ? "date" : "site"}
            </label>
            <input
              type={searchBy === "date" ? "date" : "text"}
              placeholder={searchBy === "name" ? "Entrez le nom..." : searchBy === "date" ? "Entrez la date..." : "Entrez le nom du site..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Type de recherche
            </label>
            <select
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
                setSearchTerm(""); // Clear search when changing type
              }}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors cursor-pointer min-w-[160px]"
            >
              <option value="name" className="py-2">Nom d'utilisateur</option>
              <option value="date" className="py-2">Date</option>
              <option value="site" className="py-2">Site</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Effacer
            </button>
          </div>
        </div>
        {debouncedSearchTerm && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 font-medium">
              {filteredStatistics.data.length} résultat(s) trouvé(s) sur {statistics.data.length} total
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Site</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Heures</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">TRIR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">LTIR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">DART</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Permis</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Inspections</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
                     <tbody className="divide-y divide-gray-100">
             {filteredStatistics.data.map((stat) => (
              <tr key={stat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDateOnly(stat.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {stat.contractor?.name || stat.contractor?.company_name || 'Contractor inconnu'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{stat.site}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.total_heures ?? 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.trir ?? 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.ltir ?? 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.dart ?? 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.permis_total ?? 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Number(stat.inspections_total_hse ?? 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link
                    href={route('admin.statistics.show', stat.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir détails
                  </Link>
                </td>
              </tr>
            ))}
                         {filteredStatistics.data.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-medium mb-2">Aucune statistique</div>
                    <div className="text-sm">Aucune statistique n'a été soumise pour le moment.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

             {/* Pagination */}
       {filteredStatistics.links && filteredStatistics.links.length > 3 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
                         {filteredStatistics.links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`px-3 py-2 text-sm rounded-md ${
                  link.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

AdminStatisticsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminStatisticsIndex;

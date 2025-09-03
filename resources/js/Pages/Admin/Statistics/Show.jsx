import React from "react";
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

function AdminStatisticsShow({ statistics }) {
  const n = (v) => (v === "" || v === null || v === undefined) ? 0 : Number(v) || 0;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Détails Statistiques HSE Entrepreneur</h1>
          <div className="space-y-1">
            <p className="text-gray-600">
              Soumises par {statistics.contractor?.name || statistics.contractor?.company_name || 'Entrepreneur inconnu'}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              🕐 Soumis le: {formatDate(statistics.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={route('admin.statistics.index')}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste
          </Link>
          <Link
            href={route('admin.home')}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Tableau d'administration
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <div className="text-sm font-medium text-gray-600">Site</div>
          <div className="text-2xl font-bold text-gray-900">{statistics.site}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <div className="text-sm font-medium text-gray-600">Total Heures</div>
          <div className="text-2xl font-bold text-gray-900">{n(statistics.total_heures).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <div className="text-sm font-medium text-gray-600">TRIR</div>
          <div className="text-2xl font-bold text-gray-900">{n(statistics.trir).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <div className="text-sm font-medium text-gray-600">Permis Total</div>
          <div className="text-2xl font-bold text-gray-900">{n(statistics.permis_total).toLocaleString()}</div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8">
        {/* 1) Période & Heures */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-emerald-700 border-b border-gray-200 pb-3">
            1) Période & Heures
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Site</div>
              <div className="text-lg font-semibold text-gray-900">{statistics.site}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Date</div>
              <div className="text-lg font-semibold text-gray-900">{formatDateOnly(statistics.date)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Effectif du personnel</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.effectif_personnel)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Heures normales</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.heures_normales).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Heures supplémentaires</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.heures_supplementaires).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Total heures</div>
              <div className="text-lg font-semibold text-blue-600">{n(statistics.total_heures).toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* 2) Indicateurs */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-purple-700 border-b border-gray-200 pb-3">
            2) Indicateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">TRIR</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.trir).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">LTIR</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.ltir).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">DART</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.dart).toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* 3) Accidents / Incidents */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-red-700 border-b border-gray-200 pb-3">
            3) Accidents / Incidents
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Accident mortel</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.acc_mortel)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Accident avec arrêt</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.acc_arret)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Accident avec soins médicaux</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.acc_soins_medicaux)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Accident avec restriction temporaire</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.acc_restriction_temporaire)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Premier soin</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.premier_soin)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Presque accident</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.presque_accident)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Dommage matériel</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.dommage_materiel)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Incident environnemental</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.incident_environnemental)}</div>
            </div>
          </div>
          
          {/* Accident Report File Display */}
          {statistics.accident_report && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    📄 Rapport d'accident joint
                  </span>
                  <div className="text-xs text-gray-600 mt-1">
                    Fichier téléchargé avec les statistiques
                  </div>
                </div>
                <a
                  href={`/storage/${statistics.accident_report}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger
                </a>
              </div>
            </div>
          )}
        </section>

        {/* 4) Personnel & Sensibilisation */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-indigo-700 border-b border-gray-200 pb-3">
            4) Personnel & Sensibilisation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Nombre des sensibilisations</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.nb_sensibilisations)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Total des personnes sensibilisées</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.personnes_sensibilisees)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Moyenne personnes sensibilisées (%)</div>
              <div className="text-lg font-semibold text-blue-600">{n(statistics.moyenne_sensibilisation_pourcent).toFixed(2)}%</div>
            </div>
          </div>
        </section>

        {/* 5) Formations & Inductions */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-teal-700 border-b border-gray-200 pb-3">
            5) Formations & Inductions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Total des inductions (pers.)</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.inductions_total_personnes)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Total des personnes formées</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.formes_total_personnes)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Volume horaire des inductions (h)</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.inductions_volume_heures).toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* 6) Permis & PTSR */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-cyan-700 border-b border-gray-200 pb-3">
            6) Permis & PTSR
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Permis général</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.permis_general)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Permis spécifiques total</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.permis_specifiques_total)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Total des permis</div>
              <div className="text-lg font-semibold text-blue-600">{n(statistics.permis_total)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">% PTSR contrôlé</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.ptsr_controles_pourcent).toFixed(2)}%</div>
            </div>
          </div>
        </section>

        {/* 7) Inspections & Observations */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-xl font-bold mb-6 text-lime-700 border-b border-gray-200 pb-3">
            7) Inspections & Observations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600">Total inspections HSE</div>
              <div className="text-lg font-semibold text-blue-600">{n(statistics.inspections_total_hse)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Taux fermeture actions (%)</div>
              <div className="text-lg font-semibold text-gray-900">{n(statistics.taux_fermeture_actions_pourcent).toFixed(2)}%</div>
            </div>
          </div>
          
          {/* Specific Inspection Report Files Display */}
          <div className="mt-6 space-y-3">
            {/* Inspections générales */}
            {statistics.inspection_generales_report && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🔍 Rapport d'inspection générales
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.inspection_generales_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Inspections engins */}
            {statistics.inspection_engins_report && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🚜 Rapport d'inspection engins
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.inspection_engins_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Hygiène & base vie */}
            {statistics.hygiene_base_vie_report && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🧹 Rapport d'hygiène & base vie
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.hygiene_base_vie_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Outils électroportatifs */}
            {statistics.outils_electroportatifs_report && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🔌 Rapport d'outils électroportatifs
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.outils_electroportatifs_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Inspections électriques */}
            {statistics.inspection_electriques_report && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      ⚡ Rapport d'inspection électriques
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.inspection_electriques_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Extincteurs */}
            {statistics.extincteurs_report && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🧯 Rapport d'extincteurs
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.extincteurs_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Protections collectives */}
            {statistics.protections_collectives_report && (
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      🛡️ Rapport de protections collectives
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.protections_collectives_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* EPI */}
            {statistics.epi_inspections_report && (
              <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      👷 Rapport d'inspection EPI
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.epi_inspections_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Observations HSE */}
            {statistics.observations_hse_report && (
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      👁️ Rapport d'observations HSE
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.observations_hse_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}

            {/* Actions correctives clôturées */}
            {statistics.actions_correctives_cloturees_report && (
              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      ✅ Rapport d'actions correctives clôturées
                    </span>
                  </div>
                  <a
                    href={`/storage/${statistics.actions_correctives_cloturees_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    📥 Télécharger
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

AdminStatisticsShow.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminStatisticsShow;

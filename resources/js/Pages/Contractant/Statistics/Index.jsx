import React, { useMemo } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import ContractantLayout from '../../ContractantLayout';

const SITES = ["Benguerir","Alyoussofia","Kheribga","Jerf Sfer","Asfi"];
const FACTOR = 200000;

export default function ContractorStatisticsForm() {
  const { errors } = usePage().props ?? {};
  const { data, setData, post, processing } = useForm({
    site: "", date: "",
    effectif_personnel: "", heures_normales: "", heures_supplementaires: "",
    effectif_passant_horaire_normal: "",

    acc_mortel: "", acc_arret: "", acc_soins_medicaux: "", acc_restriction_temporaire: "",
    premier_soin: "", presque_accident: "", dommage_materiel: "", incident_environnemental: "",

    nb_sensibilisations: "", personnes_sensibilisees: "",

    inductions_total_personnes: "", formes_total_personnes: "", inductions_volume_heures: "",

    excavation_sessions: "", excavation_participants: "", excavation_duree_h: "",
    points_chauds_sessions: "", points_chauds_participants: "", points_chauds_duree_h: "",
    espace_confine_sessions: "", espace_confine_participants: "", espace_confine_duree_h: "",
    levage_sessions: "", levage_participants: "", levage_duree_h: "",
    travail_hauteur_sessions: "", travail_hauteur_participants: "", travail_hauteur_duree_h: "",
    sst_sessions: "", sst_participants: "", sst_duree_h: "",
    epi_sessions: "", epi_participants: "", epi_duree_h: "",
    modes_operatoires_sessions: "", modes_operatoires_participants: "", modes_operatoires_duree_h: "",
    permis_spa_sessions: "", permis_spa_participants: "", permis_spa_duree_h: "",
    outils_electroportatifs_sessions: "", outils_electroportatifs_participants: "", outils_electroportatifs_duree_h: "",

    permis_general: "", permis_excavation: "", permis_point_chaud: "", permis_espace_confine: "",
    permis_travail_hauteur: "", permis_levage: "", permis_consignation_loto: "", permis_electrique_sous_tension: "",
    ptsr_total: "", ptsr_controles: "",

    grue: "", niveleuse: "", pelle_hydraulique: "", tractopelle: "", chargeuse: "",
    camion_citerne: "", camion_8x4: "", camion_remorque: "", grue_mobile: "", grue_tour: "",
    compacteur: "", finisseur_enrobes: "", chariot_elevateur: "", foreuse_sondeuse: "",
    brise_roche_hydraulique: "", pompe_a_beton: "", nacelle_ciseaux: "",

    compresseur_air: "", groupe_electrogene_mobile: "",

    inspections_generales: "", inspections_engins: "", hygiene_base_vie: "", outils_electroportatifs: "",
    inspections_electriques: "", extincteurs: "", protections_collectives: "", epi_inspections: "",
    observations_hse: "", actions_correctives_cloturees: "",
  });

  const n = (v)=> (v==="" || v===null || v===undefined) ? 0 : Number(v) || 0;

  const total_heures = useMemo(
    () => n(data.heures_normales) + n(data.heures_supplementaires),
    [data.heures_normales, data.heures_supplementaires]
  );

  // ✅ Include fatalities in recordables for TRIR
  const recordables =
    n(data.acc_mortel) + n(data.acc_arret) + n(data.acc_soins_medicaux) + n(data.acc_restriction_temporaire);

  const dart_cas = n(data.acc_arret) + n(data.acc_restriction_temporaire);

  const trir = total_heures > 0 ? (recordables / total_heures) * FACTOR : 0;
  const ltir = total_heures > 0 ? (n(data.acc_arret) / total_heures) * FACTOR : 0;
  const dart = total_heures > 0 ? (dart_cas * FACTOR) / total_heures : 0;

  const moyenne_sensibilisation_pourcent =
    n(data.effectif_personnel) > 0 ? (n(data.personnes_sensibilisees) / n(data.effectif_personnel)) * 100 : 0;

  const formations_total_seances =
    n(data.excavation_sessions)+n(data.points_chauds_sessions)+n(data.espace_confine_sessions)+n(data.levage_sessions)+
    n(data.travail_hauteur_sessions)+n(data.sst_sessions)+n(data.epi_sessions)+n(data.modes_operatoires_sessions)+
    n(data.permis_spa_sessions)+n(data.outils_electroportatifs_sessions);

  const formations_total_participants =
    n(data.excavation_participants)+n(data.points_chauds_participants)+n(data.espace_confine_participants)+n(data.levage_participants)+
    n(data.travail_hauteur_participants)+n(data.sst_participants)+n(data.epi_participants)+n(data.modes_operatoires_participants)+
    n(data.permis_spa_participants)+n(data.outils_electroportatifs_participants);

  const formations_total_heures =
    n(data.excavation_duree_h)+n(data.points_chauds_duree_h)+n(data.espace_confine_duree_h)+n(data.levage_duree_h)+
    n(data.travail_hauteur_duree_h)+n(data.sst_duree_h)+n(data.epi_duree_h)+n(data.modes_operatoires_duree_h)+
    n(data.permis_spa_duree_h)+n(data.outils_electroportatifs_duree_h);

  const permis_specifiques_total =
    n(data.permis_excavation)+n(data.permis_point_chaud)+n(data.permis_espace_confine)+n(data.permis_travail_hauteur)+
    n(data.permis_levage)+n(data.permis_consignation_loto)+n(data.permis_electrique_sous_tension);

  const permis_total = n(data.permis_general) + permis_specifiques_total;
  const ptsr_controles_pourcent = n(data.ptsr_total) > 0 ? (n(data.ptsr_controles) / n(data.ptsr_total)) * 100 : 0;

  const inspections_total_hse =
    n(data.inspections_generales)+n(data.inspections_engins)+n(data.hygiene_base_vie)+n(data.outils_electroportatifs)+
    n(data.inspections_electriques)+n(data.extincteurs)+n(data.protections_collectives)+n(data.epi_inspections);

  const taux_fermeture_actions_pourcent =
    n(data.observations_hse) > 0 ? (n(data.actions_correctives_cloturees) / n(data.observations_hse)) * 100 : 0;

  const onNum = (k) => (e) => {
    const value = e.target.value;
    setData(k, value);
  };
  
  const onStr = (k) => (e) => {
    const value = e.target.value;
    setData(k, value);
  };

      // disable submit if required fields missing
    const missingRequired = !data.site || !data.date ||
        data.effectif_personnel==="" || data.heures_normales==="" || data.heures_supplementaires==="";

  const submit = (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all form data
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    
    // Add CSRF token
    formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
    
    post(route('contractant.statistiques.store'), formData, { 
      preserveScroll: true,
      forceFormData: true 
    });
  };

  const Shell = ({children}) => (
  <div className="mx-auto max-w-6xl p-4 md:p-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques HSE</h1>
        <p className="text-gray-600">Formulaire de saisie des données statistiques</p>
      </div>

      <div className="flex items-center gap-4">
        <Link href={route('contractant.home')} className="text-sm text-gray-600 hover:text-gray-900 underline">← Retour</Link>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="bg-white border-b mb-6">
      <nav className="flex space-x-8">
        <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
          Remplir
        </a>
        <Link href={route('contractant.statistiques.history')} className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
          Historique
        </Link>
      </nav>
    </div>

    {children}
  </div>
);

  // Tailwind-safe grid cols (no dynamic class names)
  const gridCols = (n) => {
    switch (n) {
      case 1: return "md:grid-cols-1";
      case 2: return "md:grid-cols-2";
      case 4: return "md:grid-cols-4";
      default: return "md:grid-cols-3"; // 3
    }
  };

  // Light card with footer area for "totaux"
  const Section = ({ title, children, footerCols = 3, footer, titleColor = "text-gray-900" }) => (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 mb-8">
      <h2 className={`text-xl font-bold mb-6 ${titleColor} border-b border-gray-200 pb-3`}>
        {title}
      </h2>
      <div className="grid gap-6">{children}</div>

      {footer && (
        <div className="mt-6 border-t border-gray-200 pt-4 bg-gray-50 rounded-lg p-4">
          <div className={`grid grid-cols-1 ${gridCols(footerCols)} gap-4`}>
            {footer}
          </div>
        </div>
      )}
    </section>
  );

  const Label = ({text, error}) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{text}</span>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );

  const Num = ({label, k, step="1"}) => (
    <label className="grid gap-2">
      <Label text={label} error={errors?.[k]} />
      <input
        type="number"
        step={step}
        min="0"
        className={`rounded-lg px-4 py-3 border-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
          errors?.[k] ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        value={data[k] || ''}
        onChange={onNum(k)}
        onBlur={(e) => {
          // Ensure the value is properly formatted on blur
          const value = e.target.value;
          if (value === '' || value === null || value === undefined) {
            setData(k, '');
          } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              setData(k, numValue.toString());
            }
          }
        }}
      />
    </label>
  );

  const Read = ({label, v}) => (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="rounded-lg px-4 py-3 border-2 border-gray-200 bg-blue-50 text-blue-900 font-semibold">
        {Number.isFinite(v) ? v.toFixed(2) : '—'}
      </div>
    </div>
  );

  const Three = ({prefix}) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <Num label="Sessions" k={`${prefix}_sessions`} />
      <Num label="Participants" k={`${prefix}_participants`} />
      <Num label="Durée (h)" k={`${prefix}_duree_h`} step="0.01" />
    </div>
  );

  return (
    <ContractantLayout>
      <Shell>
        <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
          {/* 1) Période & Heures */}
          <Section
            title="1) Période & Heures"
            footerCols={1}
            footer={<Read label="Total heures" v={total_heures} />}
          >
            <div className="grid md:grid-cols-3 gap-4">
              <label className="grid gap-2">
                <Label text="Site" error={errors?.site} />
                <select
                  className={`rounded-lg px-4 py-3 border-2 transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 ${
                    errors?.site ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                  value={data.site}
                  onChange={onStr('site')}
                >
                  <option value="" className="text-gray-500">—</option>
                  {SITES.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                </select>
              </label>

                              <label className="grid gap-2">
                  <Label text="Date" error={errors?.date} />
                  <input
                    type="date"
                    className={`rounded-lg px-4 py-3 border-2 transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 ${
                      errors?.date ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    value={data.date}
                    onChange={onStr('date')}
                  />
                  <span className="text-xs text-gray-500">La date sera combinée avec l'heure actuelle</span>
                </label>

              <Num label="Effectif du personnel" k="effectif_personnel" />
              <Num label="Heures normales" k="heures_normales" step="0.01" />
              <Num label="Heures supplémentaires" k="heures_supplementaires" step="0.01" />
              <Num label="Effectif passant l'horaire normal" k="effectif_passant_horaire_normal" />
            </div>
          </Section>

          {/* 2) Indicateurs */}
          <Section
            title="2) Indicateurs (aperçu)"
            footerCols={3}
            footer={
              <>
                <Read label="TRIR" v={trir} />
                <Read label="LTIR" v={ltir} />
                <Read label="DART" v={dart} />
              </>
            }
          />

          {/* 3) Accidents / Incidents */}
          <Section 
            title="3) Accidents / Incidents"
          >
            <div className="grid md:grid-cols-4 gap-4">
              <Num label="Accident mortel" k="acc_mortel" />
              <Num label="Accident avec arrêt" k="acc_arret" />
              <Num label="Accident avec soins médicaux" k="acc_soins_medicaux" />
              <Num label="Accident avec restriction temporaire" k="acc_restriction_temporaire" />
              <Num label="Premier soin" k="premier_soin" />
              <Num label="Presque accident" k="presque_accident" />
              <Num label="Dommage matériel" k="dommage_materiel" />
              <Num label="Incident environnemental" k="incident_environnemental" />
            </div>
            
            {/* Accident Report File Upload */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">
                  📄 Rapport d'accident (optionnel)
                </span>
                <span className="text-xs text-gray-600">
                  Formats acceptés : PDF, DOC, DOCX (max 10MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="rounded-lg px-4 py-3 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setData('accident_report', file);
                    }
                  }}
                />
                {data.accident_report && (
                  <div className="text-sm text-green-600 font-medium">
                    ✅ Fichier sélectionné : {data.accident_report.name}
                  </div>
                )}
              </label>
            </div>
          </Section>

          {/* 4) Personnel & Sensibilisation */}
          <Section
            title="4) Personnel & Sensibilisation"
            footerCols={1}
            footer={<Read label="Moyenne personnes sensibilisées (%)" v={moyenne_sensibilisation_pourcent} />}
          >
            <div className="grid md:grid-cols-3 gap-4">
              <Num label="Nombre des sensibilisations" k="nb_sensibilisations" />
              <Num label="Total des personnes sensibilisées" k="personnes_sensibilisees" />
            </div>
          </Section>

          {/* 5) Formations & Inductions (totaux) */}
          <Section 
            title="5) Formations & Inductions (totaux)"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <Num label="Total des inductions (pers.)" k="inductions_total_personnes" />
              <Num label="Total des personnes formées" k="formes_total_personnes" />
              <Num label="Volume horaire des inductions (h)" k="inductions_volume_heures" step="0.01" />
            </div>
          </Section>

          {/* 6) Formations par thème */}
          <Section
            title="6) Formations par thème"
            footerCols={3}
            footer={
              <>
                <Read label="Total séances" v={formations_total_seances} />
                <Read label="Total participants" v={formations_total_participants} />
                <Read label="Total heures" v={formations_total_heures} />
              </>
            }
          >
            <div className="space-y-4">
              {[
                ['Excavation','excavation'],
                ['Points chauds','points_chauds'],
                ['Espace confiné','espace_confine'],
                ['Levage','levage'],
                ['Travail en hauteur','travail_hauteur'],
                ['SST','sst'],
                ['EPI','epi'],
                ['Modes opératoires','modes_operatoires'],
                ['Permis & SPA','permis_spa'],
                ['Outils électroportatifs','outils_electroportatifs'],
              ].map(([label,prefix]) => (
                <div key={prefix} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">{label}</h3>
                  <Three prefix={prefix} />
                </div>
              ))}
            </div>
          </Section>

          {/* 7) Permis & PTSR */}
          <Section
            title="7) Permis & PTSR"
            footerCols={3}
            footer={
              <>
                <Read label="Permis spécifiques total" v={permis_specifiques_total} />
                <Read label="Total des permis" v={permis_total} />
                <Read label="% PTSR contrôlé" v={ptsr_controles_pourcent} />
              </>
            }
          >
            <div className="grid md:grid-cols-4 gap-4">
              <Num label="Permis général" k="permis_general" />
              <Num label="Excavation" k="permis_excavation" />
              <Num label="Point chaud" k="permis_point_chaud" />
              <Num label="Espace confiné" k="permis_espace_confine" />
              <Num label="Travail en hauteur" k="permis_travail_hauteur" />
              <Num label="Levage" k="permis_levage" />
              <Num label="Consignation (LOTO)" k="permis_consignation_loto" />
              <Num label="Électrique sous tension" k="permis_electrique_sous_tension" />
              <Num label="PTSR total" k="ptsr_total" />
              <Num label="PTSR contrôlés" k="ptsr_controles" />
            </div>
          </Section>

          {/* 8) Engins & Matériels */}
          <Section 
            title="8) Engins & Matériels spécifiques"
          >
            <div className="grid md:grid-cols-4 gap-4">
              {[
                'grue','niveleuse','pelle_hydraulique','tractopelle','chargeuse',
                'camion_citerne','camion_8x4','camion_remorque','grue_mobile','grue_tour',
                'compacteur','finisseur_enrobes','chariot_elevateur','foreuse_sondeuse',
                'brise_roche_hydraulique','pompe_a_beton','nacelle_ciseaux',
                'compresseur_air','groupe_electrogene_mobile'
              ].map(k => (
                <Num key={k} label={k.replaceAll('_',' ').replace('8x4','8×4')} k={k} />
              ))}
            </div>
          </Section>

          {/* 9) Inspections & Observations */}
          <Section
            title="9) Inspections & Observations"
            footerCols={2}
            footer={
              <>
                <Read label="Total inspections HSE" v={inspections_total_hse} />
                <Read label="Taux fermeture actions (%)" v={taux_fermeture_actions_pourcent} />
              </>
            }
          >
            <div className="grid md:grid-cols-4 gap-4">
              {[
                ['Inspections générales','inspections_generales'],
                ['Inspections engins','inspections_engins'],
                ['Hygiène & base vie','hygiene_base_vie'],
                ['Outils électroportatifs','outils_electroportatifs'],
                ['Inspections électriques','inspections_electriques'],
                ['Extincteurs','extincteurs'],
                ['Protections collectives','protections_collectives'],
                ['EPI','epi_inspections'],
                ['Observations HSE','observations_hse'],
                ['Actions correctives clôturées','actions_correctives_cloturees'],
              ].map(([label,k]) => <Num key={k} label={label} k={k} />)}
            </div>
            
            {/* Specific Inspection Report File Uploads */}
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                📋 Rapports d'inspection spécifiques (optionnels)
              </h4>
              
              {/* Inspections générales */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🔍 Inspections générales
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('inspection_generales_report', file);
                      }
                    }}
                  />
                  {data.inspection_generales_report && (
                    <div className="text-sm text-blue-600 font-medium">
                      ✅ Fichier sélectionné : {data.inspection_generales_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Inspections engins */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🚜 Inspections engins
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('inspection_engins_report', file);
                      }
                    }}
                  />
                  {data.inspection_engins_report && (
                    <div className="text-sm text-green-600 font-medium">
                      ✅ Fichier sélectionné : {data.inspection_engins_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Hygiène & base vie */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🧹 Hygiène & base vie
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('hygiene_base_vie_report', file);
                      }
                    }}
                  />
                  {data.hygiene_base_vie_report && (
                    <div className="text-sm text-yellow-600 font-medium">
                      ✅ Fichier sélectionné : {data.hygiene_base_vie_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Outils électroportatifs */}
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🔌 Outils électroportatifs
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('outils_electroportatifs_report', file);
                      }
                    }}
                  />
                  {data.outils_electroportatifs_report && (
                    <div className="text-sm text-purple-600 font-medium">
                      ✅ Fichier sélectionné : {data.outils_electroportatifs_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Inspections électriques */}
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    ⚡ Inspections électriques
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('inspection_electriques_report', file);
                      }
                    }}
                  />
                  {data.inspection_electriques_report && (
                    <div className="text-sm text-red-600 font-medium">
                      ✅ Fichier sélectionné : {data.inspection_electriques_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Extincteurs */}
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🧯 Extincteurs
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('extincteurs_report', file);
                      }
                    }}
                  />
                  {data.extincteurs_report && (
                    <div className="text-sm text-orange-600 font-medium">
                      ✅ Fichier sélectionné : {data.extincteurs_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Protections collectives */}
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    🛡️ Protections collectives
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('protections_collectives_report', file);
                      }
                    }}
                  />
                  {data.protections_collectives_report && (
                    <div className="text-sm text-indigo-600 font-medium">
                      ✅ Fichier sélectionné : {data.protections_collectives_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* EPI */}
              <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    👷 EPI
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('epi_inspections_report', file);
                      }
                    }}
                  />
                  {data.epi_inspections_report && (
                    <div className="text-sm text-pink-600 font-medium">
                      ✅ Fichier sélectionné : {data.epi_inspections_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Observations HSE */}
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    👁️ Observations HSE
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('observations_hse_report', file);
                      }
                    }}
                  />
                  {data.observations_hse_report && (
                    <div className="text-sm text-teal-600 font-medium">
                      ✅ Fichier sélectionné : {data.observations_hse_report.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Actions correctives clôturées */}
              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    ✅ Actions correctives clôturées
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-lg px-3 py-2 border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setData('actions_correctives_cloturees_report', file);
                      }
                    }}
                  />
                  {data.actions_correctives_cloturees_report && (
                    <div className="text-sm text-cyan-600 font-medium">
                      ✅ Fichier sélectionné : {data.actions_correctives_cloturees_report.name}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </Section>

          {/* 10) Validation – centered */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={processing || missingRequired}
              className={`px-12 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-200
                ${missingRequired 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                }`}
                                title={missingRequired ? 'Veuillez remplir Site, Date, Effectif, Heures normales & supplémentaires' : ''}
            >
              {processing ? 'Enregistrement...' : 'Enregistrer les statistiques'}
            </button>
          </div>
        </form>
      </Shell>
    </ContractantLayout>
  );
}

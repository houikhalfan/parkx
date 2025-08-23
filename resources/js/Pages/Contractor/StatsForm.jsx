import React, { useMemo, useState, useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

/* ---------- Helpers from your snippet ---------- */
export const FACTOR = 200000;
export function computeIndicators(totalHours, recordable, lostTime, dartCases) {
  if (!Number.isFinite(totalHours) || totalHours <= 0) {
    return { TRIR: NaN, LTIR: NaN, DART: NaN };
  }
  return {
    TRIR: (recordable / totalHours) * FACTOR,
    LTIR: (lostTime / totalHours) * FACTOR,
    DART: (dartCases * FACTOR) / totalHours,
  };
}
export function averageSensibilised(totalSensibilised, effectif) {
  if (!Number.isFinite(effectif) || effectif <= 0) return NaN;
  return (totalSensibilised / effectif) * 100;
}
export function sumPermisSpec(p) {
  const parts = [p.excavation, p.pointsChauds, p.espaceConfine, p.hauteur, p.levage, p.consignationLOTO, p.travailElectrique];
  return parts.reduce((acc, v) => acc + (Number.isFinite(v) && v >= 0 ? v : 0), 0);
}
export function computePTSRPercent(controle, total) {
  if (!Number.isFinite(total) || total <= 0) return NaN;
  return (controle / total) * 100;
}

const Section = ({ title, children }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    <div className="grid gap-6">{children}</div>
  </div>
);

const Field = ({ label, name, value, onChange, required = false, min = 0, step = 1, hint }) => (
  <label className="grid gap-2">
    <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
      {label}{required && <span className="text-red-500">*</span>}
    </span>
    <input
      type="number"
      inputMode="numeric"
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      min={min}
      step={step}
      required={required}
    />
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </label>
);

const StatCard = ({ label, value, suffix }) => (
  <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-2xl font-semibold">{Number.isFinite(value) ? `${value.toFixed(2)}${suffix ?? ''}` : "-"}</div>
  </div>
);

/* ---------- Page ---------- */
export default function StatsForm({ issuedAt, reports = [] }) {
  const [active, setActive] = useState("dashboard");

  // INCIDENTS / ACCIDENTS (FR)
  const [accidents, setAccidents] = useState({
    mortel: 0, avecArret: 0, soinsMedicaux: 0, restrictionTemp: 0,
    premierSoin: 0, presqueAccident: 0, dommageMateriel: 0, incidentEnv: 0,
  });

  // PERSONNEL & SENSIBILISATION
  const [perso, setPerso] = useState({
    effectif: 0, heuresNormales: 0, heuresSup: 0, effectifPassantNormal: 0,
    nbSensibilisations: 0, personnesSensibilisees: 0,
  });

  // PERMIS & PTSR
  const [permis, setPermis] = useState({
    general: 0, excavation: 0, pointsChauds: 0, espaceConfine: 0, hauteur: 0,
    levage: 0, consignationLOTO: 0, travailElectrique: 0,
  });
  const [ptsr, setPtsr] = useState({ total: 0, controle: 0 });

  // ENGINS
  const [engins, setEngins] = useState({
    grue: 0, niveleuse: 0, pelleHydraulique: 0, tractopelle: 0, chargeuse: 0,
    camionCiterne: 0, camion8x4: 0, camionRemorque: 0,
  });

  // FORMATIONS
  const [formations, setFormations] = useState({
    personnesInduction: 0, dureeInductionH: 0, personnesFormees: 0, dureeFormationH: 0,
    excaPers: 0, excaH: 0, chaudsPers: 0, chaudsH: 0, confinePers: 0, confineH: 0,
    levagePers: 0, levageH: 0, hauteurPers: 0, hauteurH: 0, sstPers: 0, sstH: 0,
    epiPers: 0, epiH: 0, modesOpPers: 0, modesOpH: 0, permisSpaPers: 0, permisSpaH: 0,
    electroportPers: 0, electroportH: 0, spaTotal: 0,
  });

  // INSPECTIONS
  const [insp, setInsp] = useState({
    generales: 0, engins: 0, hygieneBaseVie: 0, outilsElectro: 0, electriques: 0,
    extincteurs: 0, protectionsCollectives: 0, epi: 0, observationsHSE: 0, actionsCloturees: 0,
  });

  // ---- Calculs mémoïsés ----
  const parseNum = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
  const up = (setter) => (name, value) => setter((p) => ({ ...p, [name]: parseNum(value) }));

  const totalHeures = useMemo(() => parseNum(perso.heuresNormales) + parseNum(perso.heuresSup), [perso.heuresNormales, perso.heuresSup]);

  const totalEnregistrables = useMemo(() =>
    parseNum(accidents.mortel) + parseNum(accidents.avecArret) + parseNum(accidents.soinsMedicaux) + parseNum(accidents.restrictionTemp),
    [accidents]
  );

  const casDART = useMemo(() => parseNum(accidents.avecArret) + parseNum(accidents.restrictionTemp),
    [accidents.avecArret, accidents.restrictionTemp]
  );

  const { TRIR, LTIR, DART } = useMemo(() =>
    computeIndicators(totalHeures, totalEnregistrables, parseNum(accidents.avecArret), casDART),
    [totalHeures, totalEnregistrables, accidents.avecArret, casDART]
  );

  const moyennePersonnes = useMemo(() =>
    averageSensibilised(parseNum(perso.personnesSensibilisees), parseNum(perso.effectif)),
    [perso.personnesSensibilisees, perso.effectif]
  );

  const totalPermisSpec = useMemo(() => sumPermisSpec(permis), [permis]);
  const totalPermis = useMemo(() => parseNum(permis.general) + totalPermisSpec, [permis.general, totalPermisSpec]);

  const totalInductions = useMemo(() => parseNum(formations.personnesInduction), [formations.personnesInduction]);
  const volumeInductionsH = useMemo(
    () => parseNum(formations.personnesInduction) * parseNum(formations.dureeInductionH),
    [formations.personnesInduction, formations.dureeInductionH]
  );
  const totalPersFormees = useMemo(() => parseNum(formations.personnesFormees) * 1, [formations.personnesFormees]);
  const totalHeuresFormationsGlob = useMemo(
    () => parseNum(formations.personnesFormees) * parseNum(formations.dureeFormationH),
    [formations.personnesFormees, formations.dureeFormationH]
  );
  const totalHeuresFormationsThemes = useMemo(() => {
    const { excaH, chaudsH, confineH, levageH, hauteurH, sstH, epiH, modesOpH, permisSpaH, electroportH } = formations;
    return [excaH, chaudsH, confineH, levageH, hauteurH, sstH, epiH, modesOpH, permisSpaH, electroportH].map(parseNum).reduce((a, b) => a + b, 0);
  }, [formations]);
  const totalHeuresFormations = useMemo(() => totalHeuresFormationsThemes || totalHeuresFormationsGlob, [totalHeuresFormationsThemes, totalHeuresFormationsGlob]);

  const totalInspections = useMemo(() => {
    const { generales, engins, hygieneBaseVie, outilsElectro, electriques, extincteurs, protectionsCollectives, epi } = insp;
    return [generales, engins, hygieneBaseVie, outilsElectro, electriques, extincteurs, protectionsCollectives, epi].map(parseNum).reduce((a, b) => a + b, 0);
  }, [insp]);
  const tauxFermeture = useMemo(() => {
    const obs = parseNum(insp.observationsHSE);
    if (obs <= 0) return NaN;
    return (parseNum(insp.actionsCloturees) / obs) * 100;
  }, [insp]);

  const ptsrPercent = useMemo(() => computePTSRPercent(parseNum(ptsr.controle), parseNum(ptsr.total)), [ptsr]);

  // ---- Validation ----
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const e = {};
    if (totalHeures <= 0) e.totalHeures = "Les heures totales doivent être > 0 pour calculer les indicateurs.";
    [accidents, perso, permis, engins, formations, insp, ptsr].forEach((g) => {
      Object.entries(g).forEach(([k, v]) => { if (v < 0 || !Number.isFinite(v)) e[k] = "Valeur doit être un nombre ≥ 0."; });
    });
    setErrors(e);
  }, [accidents, perso, permis, engins, formations, insp, ptsr, totalHeures]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const { post, processing } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      accidents,
      personnel: { ...perso, totalHeures, moyennePersonnes },
      permis: { ...permis, totalPermisSpec, totalPermis },
      ptsr: { ...ptsr, ptsrPercent },
      engins,
      formations: {
        ...formations,
        totalInductions,
        volumeInductionsH,
        totalPersFormees,
        totalHeuresFormations,
      },
      inspections: { ...insp, totalInspections, tauxFermeture },
      indicateurs: { TRIR, LTIR, DART },
      submittedAt: new Date().toISOString(),
    };
    post('/contractor/stats', { preserveScroll: true, data: { payload } });
  };

  const handleReset = () => {
    setAccidents({ mortel: 0, avecArret: 0, soinsMedicaux: 0, restrictionTemp: 0, premierSoin: 0, presqueAccident: 0, dommageMateriel: 0, incidentEnv: 0 });
    setPerso({ effectif: 0, heuresNormales: 0, heuresSup: 0, effectifPassantNormal: 0, nbSensibilisations: 0, personnesSensibilisees: 0 });
    setPermis({ general: 0, excavation: 0, pointsChauds: 0, espaceConfine: 0, hauteur: 0, levage: 0, consignationLOTO: 0, travailElectrique: 0 });
    setPtsr({ total: 0, controle: 0 });
    setEngins({ grue: 0, niveleuse: 0, pelleHydraulique: 0, tractopelle: 0, chargeuse: 0, camionCiterne: 0, camion8x4: 0, camionRemorque: 0 });
    setFormations({ personnesInduction: 0, dureeInductionH: 0, personnesFormees: 0, dureeFormationH: 0, excaPers: 0, excaH: 0, chaudsPers: 0, chaudsH: 0, confinePers: 0, confineH: 0, levagePers: 0, levageH: 0, hauteurPers: 0, hauteurH: 0, sstPers: 0, sstH: 0, epiPers: 0, epiH: 0, modesOpPers: 0, modesOpH: 0, permisSpaPers: 0, permisSpaH: 0, electroportPers: 0, electroportH: 0, spaTotal: 0 });
    setInsp({ generales: 0, engins: 0, hygieneBaseVie: 0, outilsElectro: 0, electriques: 0, extincteurs: 0, protectionsCollectives: 0, epi: 0, observationsHSE: 0, actionsCloturees: 0 });
    setActive("dashboard");
  };

  const Btn = ({ id, label, icon }) => (
    <button onClick={() => setActive(id)} className={"flex items-center gap-3 rounded-xl px-3 py-2 text-left transition " + (active === id ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700")} type="button">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-1 sm:px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-semibold">Statistiques — Soumission</h1>
          <div className="text-sm text-gray-600">Date d’émission: <strong>{issuedAt}</strong> &nbsp;·&nbsp; <Link href="/contractor/stats/history" className="text-indigo-600 hover:underline">Voir l’historique</Link></div>
        </div>
      </div>

      {/* Synthèse */}
      <div className="mx-auto max-w-7xl px-1 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="TRIR" value={TRIR} />
          <StatCard label="LTIR" value={LTIR} />
          <StatCard label="DART" value={DART} />
          <StatCard label="Heures totales" value={Number.isFinite(totalHeures) ? totalHeures : NaN} />
        </div>
        {Number.isNaN(TRIR) && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Saisir Heures normales + Heures supplémentaires pour calculer les indicateurs.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-1 sm:px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="sticky top-20 space-y-2 rounded-2xl border bg-white p-3 shadow-sm">
              <Btn id="dashboard" label="Tableau de bord" icon="🏁" />
              <Btn id="accidents" label="Accidents" icon="🚑" />
              <Btn id="indicateurs" label="Indicateurs" icon="📊" />
              <Btn id="personnel" label="Personnel & Sensibilisation" icon="👷" />
              <Btn id="formations" label="Formations & Inductions" icon="🎓" />
              <Btn id="permis" label="Permis & PTSR" icon="📄" />
              <Btn id="engins" label="Engins sur site" icon="🚧" />
              <Btn id="inspections" label="Inspections & Observations" icon="🔍" />
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              {active === "dashboard" && (
                <Section title="Tableau de bord">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-4">
                      <div className="rounded-xl border p-4">
                        <div className="text-sm text-gray-600 mb-2">Enregistrables = Mortel + Arrêt + Soins + Restriction</div>
                        <div className="text-3xl font-semibold">{totalEnregistrables}</div>
                      </div>
                      <div className="rounded-xl border p-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Cas DART</div>
                          <div className="text-2xl font-semibold">{casDART}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Taux fermeture</div>
                          <div className="text-2xl font-semibold">{Number.isFinite(tauxFermeture) ? `${tauxFermeture.toFixed(1)}%` : "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-xl border p-4">
                        <div className="text-sm text-gray-600">Heures (Normales + Sup)</div>
                        <div className="text-3xl font-semibold">{totalHeures}</div>
                      </div>
                      <div className="rounded-xl border p-4">
                        <div className="text-sm text-gray-600 mb-2">Effectif</div>
                        <div className="text-3xl font-semibold">{perso.effectif}</div>
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {active === "accidents" && (
                <Section title="Accidents / Incidents">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Accident mortel" name="mortel" value={accidents.mortel} onChange={up(setAccidents)} />
                    <Field label="Accident avec arrêt" name="avecArret" value={accidents.avecArret} onChange={up(setAccidents)} />
                    <Field label="Accident avec soins médicaux" name="soinsMedicaux" value={accidents.soinsMedicaux} onChange={up(setAccidents)} />
                    <Field label="Accident avec restriction temporaire" name="restrictionTemp" value={accidents.restrictionTemp} onChange={up(setAccidents)} />
                    <Field label="Premier soin" name="premierSoin" value={accidents.premierSoin} onChange={up(setAccidents)} />
                    <Field label="Presque accident" name="presqueAccident" value={accidents.presqueAccident} onChange={up(setAccidents)} />
                    <Field label="Dommage matériel" name="dommageMateriel" value={accidents.dommageMateriel} onChange={up(setAccidents)} />
                    <Field label="Incident environnemental" name="incidentEnv" value={accidents.incidentEnv} onChange={up(setAccidents)} />
                  </div>
                </Section>
              )}

              {active === "indicateurs" && (
                <Section title="Indicateurs (calculés)">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard label="TRIR" value={TRIR} />
                    <StatCard label="LTIR" value={LTIR} />
                    <StatCard label="DART" value={DART} />
                  </div>
                </Section>
              )}

              {active === "personnel" && (
                <Section title="Personnel & Sensibilisation">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nombre du personnel" name="effectif" value={perso.effectif} onChange={up(setPerso)} />
                    <Field label="Heures normales" name="heuresNormales" value={perso.heuresNormales} onChange={up(setPerso)} required />
                    <Field label="Heures supplémentaires" name="heuresSup" value={perso.heuresSup} onChange={up(setPerso)} required />
                    <Field label="Effectif passant l'horaire normal" name="effectifPassantNormal" value={perso.effectifPassantNormal} onChange={up(setPerso)} />
                    <Field label="Nombre des sensibilisations" name="nbSensibilisations" value={perso.nbSensibilisations} onChange={up(setPerso)} />
                    <Field label="Total des personnes sensibilisées" name="personnesSensibilisees" value={perso.personnesSensibilisees} onChange={up(setPerso)} />
                  </div>
                  <div className="mt-4 rounded-xl border p-4">
                    <div className="text-sm text-gray-600">Moyenne des personnes sensibilisées</div>
                    <div className="text-2xl font-semibold">{Number.isFinite(moyennePersonnes) ? `${moyennePersonnes.toFixed(1)}%` : "-"}</div>
                    <p className="mt-1 text-xs text-gray-500">Formule: (Total des personnes sensibilisées / Effectif du personnel) × 100</p>
                  </div>
                </Section>
              )}

              {active === "formations" && (
                <Section title="Formations & Inductions">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nombre des inductions (personnes)" name="personnesInduction" value={formations.personnesInduction} onChange={up(setFormations)} />
                    <Field label="Durée d'une induction (h)" name="dureeInductionH" value={formations.dureeInductionH} onChange={up(setFormations)} />
                    <Field label="Personnes formées (global)" name="personnesFormees" value={formations.personnesFormees} onChange={up(setFormations)} />
                    <Field label="Durée formation / personne (h)" name="dureeFormationH" value={formations.dureeFormationH} onChange={up(setFormations)} />
                    <Field label="Total des SPA" name="spaTotal" value={formations.spaTotal} onChange={up(setFormations)} />
                  </div>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4 rounded-xl border p-4">
                    <div><div className="text-sm text-gray-600">Volume horaire des inductions</div><div className="text-xl font-semibold">{volumeInductionsH}</div></div>
                    <div><div className="text-sm text-gray-600">Total heures de formations</div><div className="text-xl font-semibold">{totalHeuresFormations}</div></div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    {[
                      ["exca", "Travaux d'excavation"], ["chauds", "Travaux par points chauds"], ["confine", "Travaux en espace confiné"],
                      ["levage", "Travaux de levage"], ["hauteur", "Travaux en hauteur"], ["sst", "SST"], ["epi", "EPI"],
                      ["modesOp", "Modes opératoires"], ["permisSpa", "Permis & SPA"], ["electroport", "Outils électroportatifs"],
                    ].map(([key, label]) => (
                      <div key={key} className="rounded-xl border p-4 grid sm:grid-cols-2 gap-4">
                        <Field label={`${label} – personnes`} name={`${key}Pers`} value={formations[`${key}Pers`]} onChange={up(setFormations)} />
                        <Field label={`${label} – heures totales`} name={`${key}H`} value={formations[`${key}H`]} onChange={up(setFormations)} />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {active === "permis" && (
                <Section title="Permis & PTSR">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nombre des permis général" name="general" value={permis.general} onChange={up(setPermis)} />
                    <div className="sm:col-span-2 text-sm text-gray-600">Nombre des permis spécifiques : total des permis ci-dessous</div>
                    <Field label="Permis d'excavation" name="excavation" value={permis.excavation} onChange={up(setPermis)} />
                    <Field label="Permis de travaux par point chaud" name="pointsChauds" value={permis.pointsChauds} onChange={up(setPermis)} />
                    <Field label="Permis d’entrée en espace confiné" name="espaceConfine" value={permis.espaceConfine} onChange={up(setPermis)} />
                    <Field label="Permis de travail en hauteur" name="hauteur" value={permis.hauteur} onChange={up(setPermis)} />
                    <Field label="Permis de levage" name="levage" value={permis.levage} onChange={up(setPermis)} />
                    <Field label="Permis de consignation – LOTO" name="consignationLOTO" value={permis.consignationLOTO} onChange={up(setPermis)} />
                    <Field label="Permis de travail électrique sous tension" name="travailElectrique" value={permis.travailElectrique} onChange={up(setPermis)} />
                  </div>
                  <div className="mt-4 rounded-xl border p-4 grid sm:grid-cols-2 gap-4">
                    <div><div className="text-sm text-gray-600">Permis spécifiques (calcul)</div><div className="text-xl font-semibold">{totalPermisSpec}</div></div>
                    <div><div className="text-sm text-gray-600">Total des permis = (Général + Spécifiques)</div><div className="text-xl font-semibold">{totalPermis}</div></div>
                  </div>

                  <div className="mt-6 rounded-2xl border p-4">
                    <h3 className="text-lg font-semibold mb-3">PTSR – Pre-Task Safety Review</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nombre PTSR" name="total" value={ptsr.total} onChange={up(setPtsr)} />
                      <Field label="Nombre PTSR contrôlé" name="controle" value={ptsr.controle} onChange={up(setPtsr)} />
                    </div>
                    <div className="mt-4 rounded-xl border p-4">
                      <div className="text-sm text-gray-600">Pourcentage PTSR contrôlé</div>
                      <div className="text-2xl font-semibold">{Number.isFinite(ptsrPercent) ? `${ptsrPercent.toFixed(1)}%` : '-'}</div>
                      <p className="mt-1 text-xs text-gray-500">Formule : (Nombre PTSR contrôlé / Nombre PTSR) × 100</p>
                    </div>
                  </div>
                </Section>
              )}

              {active === "engins" && (
                <Section title="Engins sur site">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Grue" name="grue" value={engins.grue} onChange={up(setEngins)} />
                    <Field label="Niveleuse" name="niveleuse" value={engins.niveleuse} onChange={up(setEngins)} />
                    <Field label="Pelle hydraulique" name="pelleHydraulique" value={engins.pelleHydraulique} onChange={up(setEngins)} />
                    <Field label="Tractopelle" name="tractopelle" value={engins.tractopelle} onChange={up(setEngins)} />
                    <Field label="Chargeuse" name="chargeuse" value={engins.chargeuse} onChange={up(setEngins)} />
                    <Field label="Camion citerne" name="camionCiterne" value={engins.camionCiterne} onChange={up(setEngins)} />
                    <Field label="Camion 8×4" name="camion8x4" value={engins.camion8x4} onChange={up(setEngins)} />
                    <Field label="Camion remorque" name="camionRemorque" value={engins.camionRemorque} onChange={up(setEngins)} />
                  </div>
                </Section>
              )}

              {active === "inspections" && (
                <Section title="Inspections & Observations">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Inspections générales" name="generales" value={insp.generales} onChange={up(setInsp)} />
                    <Field label="Inspections des engins" name="engins" value={insp.engins} onChange={up(setInsp)} />
                    <Field label="Hygiène & base vie" name="hygieneBaseVie" value={insp.hygieneBaseVie} onChange={up(setInsp)} />
                    <Field label="Outils électroportatifs" name="outilsElectro" value={insp.outilsElectro} onChange={up(setInsp)} />
                    <Field label="Inspections électriques" name="electriques" value={insp.electriques} onChange={up(setInsp)} />
                    <Field label="Extincteurs" name="extincteurs" value={insp.extincteurs} onChange={up(setInsp)} />
                    <Field label="Protections collectives" name="protectionsCollectives" value={insp.protectionsCollectives} onChange={up(setInsp)} />
                    <Field label="EPI" name="epi" value={insp.epi} onChange={up(setInsp)} />
                    <Field label="Observations HSE" name="observationsHSE" value={insp.observationsHSE} onChange={up(setInsp)} />
                    <Field label="Actions correctives clôturées" name="actionsCloturees" value={insp.actionsCloturees} onChange={up(setInsp)} />
                  </div>
                  <div className="mt-4 rounded-xl border p-4 grid sm:grid-cols-2 gap-4">
                    <div><div className="text-sm text-gray-600">Inspections HSE (calcul)</div><div className="text-xl font-semibold">{totalInspections}</div></div>
                    <div><div className="text-sm text-gray-600">Taux de fermeture des actions correctives</div><div className="text-xl font-semibold">{Number.isFinite(tauxFermeture) ? `${tauxFermeture.toFixed(1)}%` : "-"}</div></div>
                  </div>
                </Section>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <button type="submit" disabled={!isValid || processing}
                  className={"inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-white shadow-sm transition " + ((isValid && !processing) ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" : "bg-gray-400 cursor-not-allowed")}>
                  {processing ? 'Envoi…' : 'Soumettre'}
                </button>
                <button type="button" onClick={handleReset} className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300">Réinitialiser</button>
                {!isValid && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="font-semibold mb-1">Corrigez les points suivants :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([k, msg]) => (<li key={k}><span className="font-medium">{k}</span>: {msg}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Historique récent */}
            <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Historique récent</h3>
                <Link href="/contractor/stats/history" className="text-sm text-indigo-600 hover:underline">Tout voir</Link>
              </div>
              {(!reports || reports.length === 0) ? (
                <p className="text-sm text-gray-500">Aucun rapport pour le moment.</p>
              ) : (
                <ul className="divide-y">
                  {reports.map(r => (
                    <li key={r.id} className="py-2 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">{r.date}</span>
                        <span className="text-gray-500"> — TRIR {Number(r.trir).toFixed(2)}, LTIR {Number(r.ltir).toFixed(2)}, DART {Number(r.dart).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </form>
    </div>
  );
}

StatsForm.layout = (page) => <DashboardLayout children={page} />;

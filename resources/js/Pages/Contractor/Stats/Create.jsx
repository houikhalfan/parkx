import React, { useMemo, useState, useEffect } from "react";

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
  const parts = [
    p.excavation,
    p.pointsChauds,
    p.espaceConfine,
    p.hauteur,
    p.levage,
    p.consignationLOTO,
    p.travailElectrique,
  ];
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
      {label}
      {required && <span className="text-red-500">*</span>}
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

export default function HSEFormApp() {
  const [active, setActive] = useState("dashboard");

  const [accidents, setAccidents] = useState({
    mortel: 0,
    avecArret: 0,
    soinsMedicaux: 0,
    restrictionTemp: 0,
    premierSoin: 0,
    presqueAccident: 0,
    dommageMateriel: 0,
    incidentEnv: 0,
  });

  const [perso, setPerso] = useState({
    effectif: 0,
    heuresNormales: 0,
    heuresSup: 0,
    effectifPassantNormal: 0,
    nbSensibilisations: 0,
    personnesSensibilisees: 0,
  });

  const [permis, setPermis] = useState({
    general: 0,
    excavation: 0,
    pointsChauds: 0,
    espaceConfine: 0,
    hauteur: 0,
    levage: 0,
    consignationLOTO: 0,
    travailElectrique: 0,
  });
  const [ptsr, setPtsr] = useState({ total: 0, controle: 0 });

  const [engins, setEngins] = useState({
    grue: 0,
    niveleuse: 0,
    pelleHydraulique: 0,
    tractopelle: 0,
    chargeuse: 0,
    camionCiterne: 0,
    camion8x4: 0,
    camionRemorque: 0,
    grueMobile: 0,
    grueTour: 0,
    compacteur: 0,
    finisseur: 0,
    chariotElevateur: 0,
    foreuse: 0,
    briseRoche: 0,
    pompesBeton: 0,
    nacelle: 0,
    compresseur: 0,
    groupesElectrogenes: 0,
  });

  const [formations, setFormations] = useState({
    personnesInduction: 0,
    dureeInductionH: 0,
    personnesFormees: 0,
    dureeFormationH: 0,
    excaPers: 0, excaH: 0, excaTotal: 0,
    chaudsPers: 0, chaudsH: 0,
    confinePers: 0, confineH: 0,
    levagePers: 0, levageH: 0,
    hauteurPers: 0, hauteurH: 0,
    sstPers: 0, sstH: 0,
    epiPers: 0, epiH: 0,
    modesOpPers: 0, modesOpH: 0,
    permisSpaPers: 0, permisSpaH: 0,
    electroportPers: 0, electroportH: 0,
    spaTotal: 0,
  });

  const [insp, setInsp] = useState({
    generales: 0,
    engins: 0,
    hygieneBaseVie: 0,
    outilsElectro: 0,
    electriques: 0,
    extincteurs: 0,
    protectionsCollectives: 0,
    epi: 0,
    observationsHSE: 0,
    actionsCloturees: 0,
  });

  const parseNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  const up = (setter) => (name, value) => setter((p) => ({ ...p, [name]: parseNum(value) }));

  const totalHeures = useMemo(
    () => parseNum(perso.heuresNormales) + parseNum(perso.heuresSup),
    [perso.heuresNormales, perso.heuresSup]
  );

  const totalEnregistrables = useMemo(
    () => parseNum(accidents.mortel) + parseNum(accidents.avecArret) + parseNum(accidents.soinsMedicaux) + parseNum(accidents.restrictionTemp),
    [accidents]
  );

  const casDART = useMemo(
    () => parseNum(accidents.avecArret) + parseNum(accidents.restrictionTemp),
    [accidents.avecArret, accidents.restrictionTemp]
  );

  const { TRIR, LTIR, DART } = useMemo(() => (
    computeIndicators(totalHeures, totalEnregistrables, parseNum(accidents.avecArret), casDART)
  ), [totalHeures, totalEnregistrables, accidents.avecArret, casDART]);

  const moyennePersonnes = useMemo(() => (
    averageSensibilised(parseNum(perso.personnesSensibilisees), parseNum(perso.effectif))
  ), [perso.personnesSensibilisees, perso.effectif]);

  const totalPermisSpec = useMemo(() => sumPermisSpec(permis), [permis]);
  const totalPermis = useMemo(() => parseNum(permis.general) + totalPermisSpec, [permis.general, totalPermisSpec]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HSE SUBMIT ▶", { accidents, perso, permis, ptsr, engins, formations, insp });
    alert("Données envoyées dans la console (soumission fictive).");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 pb-16">
        
        {/* Formations & Inductions */}
        <Section title="Formations & Inductions">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Travaux d'excavation – personnes" name="excaPers" value={formations.excaPers} onChange={up(setFormations)} />
            <Field label="Travaux d'excavation – heures totales" name="excaH" value={formations.excaH} onChange={up(setFormations)} />
            <Field label="Travaux d'excavation – Total d’heures" name="excaTotal" value={formations.excaTotal} onChange={up(setFormations)} />
          </div>
        </Section>

        {/* Engins */}
        <Section title="Engins sur site & Matériels et équipements spécifiques">
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.keys(engins).map((key) => (
              <Field key={key} label={key} name={key} value={engins[key]} onChange={up(setEngins)} />
            ))}
          </div>
        </Section>

        <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
          Soumettre
        </button>
      </form>
    </div>
  );
}

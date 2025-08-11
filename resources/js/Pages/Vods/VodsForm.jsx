import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function VodsForm() {
  const { auth, flash: _flash } = usePage().props;
  const flash = _flash || {};
  const today = new Date().toLocaleDateString('fr-FR');

  // NEW — read shared quota info
  const { quota } = usePage().props || {};
  const canSubmit = quota?.canSubmit ?? true;
  const remaining = quota?.remaining ?? null;
  const daysLeft  = quota?.daysLeft ?? null;

  // NEW — to fully reset file inputs after success
  const [formVersion, setFormVersion] = useState(0);

  const [header, setHeader] = useState({
    date: '',
    projet: '',
    activite: '',
    observateur: auth?.user?.name || '',
    personnesObservees: [''],
    entrepriseObservee: [''],
  });

  const [pratiques, setPratiques] = useState([{ text: '', photo: null }]);
  const [comportements, setComportements] = useState([{ type: '', description: '', photo: null }]);
  const [conditions, setConditions] = useState({});
  const [correctives, setCorrectives] = useState({});
  const [autresConditions, setAutresConditions] = useState([]);

  const [errors, setErrors] = useState({});
  const [topAlert, setTopAlert] = useState(null);
  const alertRef = useRef(null);

  useEffect(() => {
    if (topAlert && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      alertRef.current.focus?.();
    }
  }, [topAlert]);

  const onlyLetters = (text) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test((text || '').trim());

  const comportementOptions = [
    "Risques de chutes de plain-pied & chutes en hauteur",
    "Risques de manutention manuelle",
    "Risques de manutention mécanisée",
    "Risques de circulations & déplacements",
    "Risques d’effondrements & chutes d’objets",
    "Risques de toxicité",
    "Risques d’incendies & explosions",
    "Risques biologiques",
    "Risques d’électricité",
    "Risques de manque d’hygiène",
    "Risques de bruits",
    "Risques de vibrations",
    "Risques d’ambiances thermiques",
    "Risques d’ambiances lumineuses",
    "Risques de rayonnements",
    "Risques de machines & outils",
    "Risques d’interventions en entreprises extérieures",
    "Risques d’organisation du travail & Stress",
  ];

  const dangerousConditionsList = [
    "EPI", "Environnement de travail", "Conditions de travail", "Outillage",
    "Procédures et modes opératoires", "Qualifications, habilitation et formation",
    "Inappropriés aux risques", "Housekeeping insatisfaisant", "Mauvaise ergonomie",
    "Mauvais état de conformité", "Non portés correctement", "Gestion de déchets insatisfaisante",
    "Problème d’accessibilité", "Inappropriés aux tâches", "Inadéquats aux tâches",
    "Non appliqués ou appliqués incorrectement", "En mauvais état",
    "Présence de fuites et émanations", "Non utilisés correctement", "Personnel non formé",
    "Personnel non habilité"
  ];

  const handleFileUpload = (list, setList, index, file, key = 'photo') => {
    const updated = [...list];
    updated[index][key] = file;
    setList(updated);
  };

  const handleConditionToggle = (key) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCorrectiveChange = (key, field, value) => {
    setCorrectives(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!header.date) newErrors.date = "La date est requise.";
    if (!header.projet) newErrors.projet = "Le projet est requis.";
    if (!header.activite) newErrors.activite = "L'activité est requise.";

    if (header.projet && !onlyLetters(header.projet)) newErrors.projet = "Le projet ne doit contenir que des lettres et des espaces.";
    if (header.activite && !onlyLetters(header.activite)) newErrors.activite = "L’activité ne doit contenir que des lettres et des espaces.";

    if (!header.personnesObservees[0]) newErrors.personnesObservees = "Au moins une personne observée est requise.";
    header.personnesObservees.forEach((p, i) => { if (p && !onlyLetters(p)) newErrors[`personnesObservees_${i}`] = "Seules les lettres et espaces sont autorisés."; });

    if (!header.entrepriseObservee[0]) newErrors.entrepriseObservee = "Au moins une entreprise observée est requise.";
    header.entrepriseObservee.forEach((e, i) => { if (e && !onlyLetters(e)) newErrors[`entrepriseObservee_${i}`] = "Seules les lettres et espaces sont autorisés."; });

    pratiques.forEach((p, i) => { if (p.text && !p.photo) newErrors[`pratique_${i}`] = "L’image est requise pour la bonne pratique."; });
    comportements.forEach((c, i) => { if ((c.type || c.description) && !c.photo) newErrors[`comportement_${i}`] = "L’image est requise pour le comportement."; });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTopAlert(null);

    // NEW — hard block on client
    if (!canSubmit) {
      setTopAlert("Quota mensuel atteint. Impossible de soumettre un nouveau VOD.");
      return;
    }

    if (!validateForm()) {
      setTopAlert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();

    Object.entries(header).forEach(([key, val]) => {
      if (Array.isArray(val)) val.forEach((v, i) => formData.append(`${key}[${i}]`, v));
      else formData.append(key, val);
    });

    pratiques.forEach((p, i) => {
      formData.append(`pratiques[${i}][text]`, p.text || '');
      if (p.photo) formData.append(`pratiques[${i}][photo]`, p.photo);
    });

    comportements.forEach((c, i) => {
      formData.append(`comportements[${i}][type]`, c.type || '');
      formData.append(`comportements[${i}][description]`, c.description || '');
      if (c.photo) formData.append(`comportements[${i}][photo]`, c.photo);
    });

    Object.entries(conditions).forEach(([key, val]) => {
      formData.append(`conditions[${key}]`, val ? '1' : '0');
    });

    Object.entries(correctives).forEach(([key, val]) => {
      Object.entries(val || {}).forEach(([f, v]) => {
        if (v instanceof File) formData.append(`correctives[${key}][${f}]`, v);
        else formData.append(`correctives[${key}][${f}]`, v ?? '');
      });
    });

    router.post('/vods/store', formData, {
      forceFormData: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      preserveScroll: false, // NEW — land at top after response
      onSuccess: () => {
        // NEW — clear the form completely (including file inputs)
        setHeader({
          date: '',
          projet: '',
          activite: '',
          observateur: auth?.user?.name || '',
          personnesObservees: [''],
          entrepriseObservee: [''],
        });
        setPratiques([{ text: '', photo: null }]);
        setComportements([{ type: '', description: '', photo: null }]);
        setConditions({});
        setCorrectives({});
        setAutresConditions([]);
        setErrors({});
        setTopAlert(null);
        setFormVersion(v => v + 1); // remount to reset files
        window.scrollTo({ top: 0, behavior: 'smooth' }); // safety scroll
      },
      onError: (serverErrors) => {
        setTopAlert("Des erreurs de validation sont survenues. Merci de corriger les champs en rouge.");
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      },
    });
  };

  const lettersOnlyProps = { pattern: "[A-Za-zÀ-ÖØ-öø-ÿ\\s]+", title: "Lettres et espaces uniquement" };

  return (
    // NEW — key triggers full reset after success
    <form key={formVersion} onSubmit={handleSubmit} noValidate className="p-8 bg-white shadow-xl rounded-lg max-w-6xl mx-auto space-y-10">
      {/* Alerts */}
      {topAlert && (
        <div ref={alertRef} role="alert" tabIndex={-1} className="p-4 mb-4 rounded border border-red-400 bg-red-50 text-red-700">
          {topAlert}
        </div>
      )}
      {flash.success && (
        <div role="status" className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      {/* NEW — quota info banners */}
      {typeof remaining === 'number' && remaining > 0 && (
        <div className="p-3 rounded border border-amber-400 bg-amber-50 text-amber-800">
          Il vous reste <strong>{remaining}</strong> VOD(s) à soumettre ce mois-ci
          {typeof daysLeft === 'number' && <> — Jours restants : <strong>{daysLeft}</strong></>}.
        </div>
      )}
      {canSubmit === false && (
        <div className="p-3 rounded border border-red-400 bg-red-50 text-red-700">
          Quota mensuel atteint — le formulaire est bloqué jusqu’au mois prochain.
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-gray-800">Visite Observation et Ronde HSE</h1>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Date d’émission:</strong> {today}
        </div>
      </div>

      {/* NEW — disable all inputs when quota reached */}
      <fieldset disabled={!canSubmit} className={!canSubmit ? 'opacity-60 pointer-events-none select-none' : ''}>
        {/* Champs d’entête */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input type="date" value={header.date} onChange={(e) => setHeader({ ...header, date: e.target.value })} className="input" required />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div>
            <input type="text" placeholder="Projet" value={header.projet} onChange={(e) => setHeader({ ...header, projet: e.target.value })} className="input" {...lettersOnlyProps} required />
            {errors.projet && <p className="text-red-500 text-sm">{errors.projet}</p>}
          </div>

          <div>
            <input type="text" placeholder="Activité" value={header.activite} onChange={(e) => setHeader({ ...header, activite: e.target.value })} className="input" {...lettersOnlyProps} required />
            {errors.activite && <p className="text-red-500 text-sm">{errors.activite}</p>}
          </div>

          <div>
            <input type="text" value={header.observateur} readOnly className="input bg-gray-100 text-gray-700 cursor-not-allowed" />
          </div>

          {/* Personnes observées */}
          <div className="md:col-span-3 space-y-2">
            {header.personnesObservees.map((person, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Personne observée ${index + 1}`}
                  value={person}
                  onChange={(e) => {
                    const updated = [...header.personnesObservees];
                    updated[index] = e.target.value;
                    setHeader({ ...header, personnesObservees: updated });
                  }}
                  className="input"
                  {...lettersOnlyProps}
                  required={index === 0}
                />
                {index === 0 && errors.personnesObservees && <p className="text-red-500 text-sm">{errors.personnesObservees}</p>}
                {errors[`personnesObservees_${index}`] && <p className="text-red-500 text-sm">{errors[`personnesObservees_${index}`]}</p>}
              </div>
            ))}
            <button type="button" onClick={() => setHeader({ ...header, personnesObservees: [...header.personnesObservees, ''] })} className="text-blue-500 hover:underline">
              + Ajouter personne
            </button>
          </div>

          {/* Entreprises observées */}
          <div className="md:col-span-3 space-y-2">
            {header.entrepriseObservee.map((entreprise, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Entreprise observée ${index + 1}`}
                  value={entreprise}
                  onChange={(e) => {
                    const updated = [...header.entrepriseObservee];
                    updated[index] = e.target.value;
                    setHeader({ ...header, entrepriseObservee: updated });
                  }}
                  className="input"
                  {...lettersOnlyProps}
                  required={index === 0}
                />
                {index === 0 && errors.entrepriseObservee && <p className="text-red-500 text-sm">{errors.entrepriseObservee}</p>}
                {errors[`entrepriseObservee_${index}`] && <p className="text-red-500 text-sm">{errors[`entrepriseObservee_${index}`]}</p>}
              </div>
            ))}
            <button type="button" onClick={() => setHeader({ ...header, entrepriseObservee: [...header.entrepriseObservee, ''] })} className="text-blue-500 hover:underline">
              + Ajouter entreprise
            </button>
          </div>
        </div>

        {/* Bonnes pratiques */}
        <section>
          <h3 className="text-xl font-semibold text-green-600 mt-10 mb-4">Bonnes pratiques</h3>
          {pratiques.map((item, i) => (
            <div key={i} className="flex gap-3 items-center mb-3">
              <input
                type="text"
                placeholder="Description"
                value={item.text}
                onChange={(e) => {
                  const updated = [...pratiques];
                  updated[i].text = e.target.value;
                  setPratiques(updated);
                }}
                className="input flex-1"
              />
              <input type="file" onChange={(e) => handleFileUpload(pratiques, setPratiques, i, e.target.files[0])} />
              {errors[`pratique_${i}`] && <p className="text-red-500 text-sm">{errors[`pratique_${i}`]}</p>}
            </div>
          ))}
          <button type="button" onClick={() => setPratiques([...pratiques, { text: '', photo: null }])} className="text-blue-500 hover:underline">
            + Ajouter
          </button>
        </section>

        {/* Comportements dangereux */}
        <section>
          <h3 className="text-xl font-semibold text-red-600 mt-10 mb-4">Comportements dangereux</h3>
          {comportements.map((item, i) => (
            <div key={i} className="mb-4 space-y-2">
              <select
                value={item.type}
                onChange={(e) => {
                  const updated = [...comportements];
                  updated[i].type = e.target.value;
                  setComportements(updated);
                }}
                className="input w-full"
              >
                <option value="">-- Choisir un type de risque --</option>
                {comportementOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const updated = [...comportements];
                  updated[i].description = e.target.value;
                  setComportements(updated);
                }}
                className="input w-full"
              />
              <input type="file" onChange={(e) => handleFileUpload(comportements, setComportements, i, e.target.files[0])} />
              {errors[`comportement_${i}`] && <p className="text-red-500 text-sm">{errors[`comportement_${i}`]}</p>}
            </div>
          ))}
          <button type="button" onClick={() => setComportements([...comportements, { type: '', description: '', photo: null }])} className="text-blue-500 hover:underline">
            + Ajouter
          </button>
        </section>

        {/* Conditions dangereuses */}
        <section>
          <h3 className="text-xl font-semibold mt-10 mb-4">Conditions dangereuses</h3>
          {dangerousConditionsList.map((cond) => (
            <div key={cond} className="flex items-center gap-3 mb-2">
              <input type="checkbox" checked={!!conditions[cond]} onChange={() => handleConditionToggle(cond)} />
              <label>{cond}</label>
            </div>
          ))}
          {autresConditions.map((val, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-2">
              <input
                type="text"
                placeholder="Autre condition"
                value={val}
                onChange={(e) => {
                  const copy = [...autresConditions];
                  copy[idx] = e.target.value;
                  setAutresConditions(copy);
                }}
                onBlur={(e) => {
                  const name = e.target.value.trim();
                  if (name && !conditions[name]) setConditions((prev) => ({ ...prev, [name]: true }));
                }}
                className="input flex-1"
              />
            </div>
          ))}
          <button type="button" onClick={() => setAutresConditions([...autresConditions, ''])} className="text-blue-500 hover:underline">
            + Ajouter une autre
          </button>
        </section>

        {/* Actions correctives */}
        <section>
          <h3 className="text-xl font-semibold text-green-600 mt-10 mb-4">Actions correctives</h3>
          {Object.entries(conditions).filter(([_, val]) => val).map(([key]) => (
            <div key={key} className="border-l-4 border-green-500 bg-green-50 p-4 rounded mb-4 shadow-sm">
              <h4 className="font-semibold mb-2 text-gray-800">{key}</h4>
              <input type="text" placeholder="Action" onChange={(e) => handleCorrectiveChange(key, 'action', e.target.value)} className="input mb-2 w-full" />
              <input type="text" placeholder="Responsable" onChange={(e) => handleCorrectiveChange(key, 'responsable', e.target.value)} className="input mb-2 w-full" />
              <input type="text" placeholder="Statut" onChange={(e) => handleCorrectiveChange(key, 'statut', e.target.value)} className="input mb-2 w-full" />
              <input type="file" onChange={(e) => handleCorrectiveChange(key, 'photo', e.target.files[0])} className="mb-2" />
            </div>
          ))}
        </section>
      </fieldset>

      <div className="pt-8">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-6 py-3 rounded text-white ${!canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          Soumettre le formulaire
        </button>
      </div>
    </form>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function VodsForm() {
  const { auth, flash: _flash } = usePage().props;
  const flash = _flash || {};

  const { quota } = usePage().props || {};
  const canSubmit = quota?.canSubmit ?? true;
  const remaining = quota?.remaining ?? null;
  const daysLeft  = quota?.daysLeft ?? null;

  const [formVersion, setFormVersion] = useState(0);

  // Mobile detection for default-collapsed sections
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayHuman = useMemo(() => new Date().toLocaleDateString('fr-FR'), []);
  const onlyLetters = (text) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test((text || '').trim());
  const lettersOnlyProps = { pattern: "[A-Za-zÀ-ÖØ-öø-ÿ\\s]+", title: "Lettres et espaces uniquement" };

  const [header, setHeader] = useState({
    date: '',
    projet: '',
    activite: '',
    observateur: auth?.user?.name || '',
    personnesObservees: [''],
    entrepriseObservee: [''],
  });

  useEffect(() => {
    setHeader((h) => h.date ? h : { ...h, date: todayIso });
  }, [todayIso]);

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
    "EPI","Environnement de travail","Conditions de travail","Outillage",
    "Procédures et modes opératoires","Qualifications, habilitation et formation",
    "Inappropriés aux risques","Housekeeping insatisfaisant","Mauvaise ergonomie",
    "Mauvais état de conformité","Non portés correctement","Gestion de déchets insatisfaisante",
    "Problème d’accessibilité","Inappropriés aux tâches","Inadéquats aux tâches",
    "Non appliqués ou appliqués incorrectement","En mauvais état",
    "Présence de fuites et émanations","Non utilisés correctement","Personnel non formé",
    "Personnel non habilité"
  ];

  const handleFileUpload = (list, setList, index, file, key = 'photo') => {
    const updated = [...list];
    updated[index][key] = file || null;
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
      preserveScroll: false,
      onSuccess: () => {
        setHeader({
          date: todayIso,
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
        setFormVersion(v => v + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (serverErrors) => {
        setTopAlert("Des erreurs de validation sont survenues. Merci de corriger les champs en rouge.");
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      },
    });
  };

  return (
    <form
      key={formVersion}
      onSubmit={handleSubmit}
      noValidate
      className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg max-w-3xl lg:max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-28 md:pb-8"
    >
      {/* Alerts */}
      {topAlert && (
        <div ref={alertRef} role="alert" tabIndex={-1} className="p-3 sm:p-4 rounded border border-red-400 bg-red-50 text-red-700">
          {topAlert}
        </div>
      )}
      {flash.success && (
        <div role="status" className="p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      {/* Quota banners */}
      {typeof remaining === 'number' && remaining > 0 && (
        <div className="p-3 rounded border border-amber-400 bg-amber-50 text-amber-800 text-sm sm:text-base">
          Il vous reste <strong>{remaining}</strong> VOD(s) à soumettre ce mois-ci
          {typeof daysLeft === 'number' && <> — Jours restants : <strong>{daysLeft}</strong></>}.
        </div>
      )}
      {canSubmit === false && (
        <div className="p-3 rounded border border-red-400 bg-red-50 text-red-700 text-sm sm:text-base">
          Quota mensuel atteint — le formulaire est bloqué jusqu’au mois prochain.
        </div>
      )}

      {/* Header */}
      <div className="space-y-3 border-b pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-8 sm:h-10" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Visite Observation et Ronde HSE</h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <strong>Date d’émission:</strong> {todayHuman}
          </div>
        </div>

        <fieldset disabled={!canSubmit} className={!canSubmit ? 'opacity-60 pointer-events-none select-none' : ''}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <Field
              label="Date"
              error={errors.date}
              input={
                <input
                  type="date"
                  value={header.date}
                  onChange={(e) => setHeader({ ...header, date: e.target.value })}
                  className="input w-full"
                  required
                  aria-invalid={!!errors.date}
                />
              }
            />

            <Field
              label="Projet"
              error={errors.projet}
              input={
                <input
                  type="text"
                  placeholder="Projet"
                  value={header.projet}
                  onChange={(e) => setHeader({ ...header, projet: e.target.value })}
                  className="input w-full"
                  {...lettersOnlyProps}
                  required
                  aria-invalid={!!errors.projet}
                />
              }
            />

            <Field
              label="Activité"
              error={errors.activite}
              input={
                <input
                  type="text"
                  placeholder="Activité"
                  value={header.activite}
                  onChange={(e) => setHeader({ ...header, activite: e.target.value })}
                  className="input w-full"
                  {...lettersOnlyProps}
                  required
                  aria-invalid={!!errors.activite}
                />
              }
            />

            <Field
              className="md:col-span-3"
              label="Observateur"
              input={
                <input
                  type="text"
                  value={header.observateur}
                  readOnly
                  className="input w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              }
            />

            {/* Personnes observées */}
            <div className="md:col-span-3 space-y-2">
              <Label>Personnes observées</Label>
              <div className="space-y-2">
                {header.personnesObservees.map((person, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder={`Personne observée ${index + 1}`}
                      value={person}
                      onChange={(e) => {
                        const updated = [...header.personnesObservees];
                        updated[index] = e.target.value;
                        setHeader({ ...header, personnesObservees: updated });
                      }}
                      className="input w-full"
                      {...lettersOnlyProps}
                      required={index === 0}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...header.personnesObservees];
                          copy.splice(index, 1);
                          setHeader({ ...header, personnesObservees: copy });
                        }}
                        className="px-3 py-2 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                ))}
                {errors.personnesObservees && <p className="text-red-500 text-sm">{errors.personnesObservees}</p>}
                {header.personnesObservees.map((_, i) =>
                  errors[`personnesObservees_${i}`] ? (
                    <p key={i} className="text-red-500 text-sm">{errors[`personnesObservees_${i}`]}</p>
                  ) : null
                )}
                <button
                  type="button"
                  onClick={() => setHeader({ ...header, personnesObservees: [...header.personnesObservees, ''] })}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Ajouter personne
                </button>
              </div>
            </div>

            {/* Entreprises observées */}
            <div className="md:col-span-3 space-y-2">
              <Label>Entreprises observées</Label>
              <div className="space-y-2">
                {header.entrepriseObservee.map((entreprise, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder={`Entreprise observée ${index + 1}`}
                      value={entreprise}
                      onChange={(e) => {
                        const updated = [...header.entrepriseObservee];
                        updated[index] = e.target.value;
                        setHeader({ ...header, entrepriseObservee: updated });
                      }}
                      className="input w-full"
                      {...lettersOnlyProps}
                      required={index === 0}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...header.entrepriseObservee];
                          copy.splice(index, 1);
                          setHeader({ ...header, entrepriseObservee: copy });
                        }}
                        className="px-3 py-2 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                ))}
                {errors.entrepriseObservee && <p className="text-red-500 text-sm">{errors.entrepriseObservee}</p>}
                {header.entrepriseObservee.map((_, i) =>
                  errors[`entrepriseObservee_${i}`] ? (
                    <p key={i} className="text-red-500 text-sm">{errors[`entrepriseObservee_${i}`]}</p>
                  ) : null
                )}
                <button
                  type="button"
                  onClick={() => setHeader({ ...header, entrepriseObservee: [...header.entrepriseObservee, ''] })}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Ajouter entreprise
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Bonnes pratiques */}
      <SectionCard title="Bonnes pratiques" defaultOpen={!isMobile}>
        {pratiques.map((item, i) => (
          <div key={i} className="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-3 mb-3">
            <input
              type="text"
              placeholder="Description"
              value={item.text}
              onChange={(e) => {
                const updated = [...pratiques];
                updated[i].text = e.target.value;
                setPratiques(updated);
              }}
              className="input w-full sm:flex-1"
            />
            <div className="flex items-center gap-2">
              <ImageInput
                file={item.photo}
                onChange={(file) => handleFileUpload(pratiques, setPratiques, i, file)}
                ariaLabel={`Photo bonne pratique ${i + 1}`}
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...pratiques];
                    copy.splice(i, 1);
                    setPratiques(copy);
                  }}
                  className="px-3 py-2 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Retirer
                </button>
              )}
            </div>
            {errors[`pratique_${i}`] && <p className="text-red-500 text-sm">{errors[`pratique_${i}`]}</p>}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPratiques([...pratiques, { text: '', photo: null }])}
          className="text-blue-600 hover:underline text-sm"
        >
          + Ajouter
        </button>
      </SectionCard>

      {/* Comportements dangereux */}
      <SectionCard title="Comportements dangereux" defaultOpen={!isMobile}>
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
            <div className="flex items-center gap-2">
              <ImageInput
                file={item.photo}
                onChange={(file) => handleFileUpload(comportements, setComportements, i, file)}
                ariaLabel={`Photo comportement ${i + 1}`}
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...comportements];
                    copy.splice(i, 1);
                    setComportements(copy);
                  }}
                  className="px-3 py-2 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Retirer
                </button>
              )}
            </div>
            {errors[`comportement_${i}`] && <p className="text-red-500 text-sm">{errors[`comportement_${i}`]}</p>}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setComportements([...comportements, { type: '', description: '', photo: null }])}
          className="text-blue-600 hover:underline text-sm"
        >
          + Ajouter
        </button>
      </SectionCard>

      {/* Conditions dangereuses */}
      <SectionCard title="Conditions dangereuses" defaultOpen={!isMobile}>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-2">
          {dangerousConditionsList.map((cond) => (
            <label key={cond} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!conditions[cond]}
                onChange={() => handleConditionToggle(cond)}
              />
              <span className="leading-snug">{cond}</span>
            </label>
          ))}
        </div>

        {autresConditions.map((val, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
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
              className="input w-full sm:flex-1"
            />
            <button
              type="button"
              onClick={() => {
                const copy = [...autresConditions];
                copy.splice(idx, 1);
                setAutresConditions(copy);
              }}
              className="px-3 py-2 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Retirer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAutresConditions([...autresConditions, ''])}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          + Ajouter une autre
        </button>
      </SectionCard>

      {/* Actions correctives */}
      <SectionCard title="Actions correctives" defaultOpen={!isMobile}>
        {Object.entries(conditions).filter(([, val]) => val).length === 0 ? (
          <p className="text-sm text-gray-500">Sélectionnez des conditions dangereuses pour saisir des actions.</p>
        ) : null}
        {Object.entries(conditions).filter(([, val]) => val).map(([key]) => (
          <div key={key} className="border-l-4 border-green-500 bg-green-50 p-4 rounded mb-4 shadow-sm space-y-2">
            <h4 className="font-semibold text-gray-800">{key}</h4>
            <input type="text" placeholder="Action" onChange={(e) => handleCorrectiveChange(key, 'action', e.target.value)} className="input w-full" />
            <input type="text" placeholder="Responsable" onChange={(e) => handleCorrectiveChange(key, 'responsable', e.target.value)} className="input w-full" />
            <input type="text" placeholder="Statut" onChange={(e) => handleCorrectiveChange(key, 'statut', e.target.value)} className="input w-full" />
            <ImageInput file={correctives[key]?.photo || null} onChange={(file) => handleCorrectiveChange(key, 'photo', file)} ariaLabel={`Photo corrective ${key}`} />
          </div>
        ))}
      </SectionCard>

      {/* Desktop submit */}
      <div className="pt-2 hidden md:block">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-6 py-3 rounded text-white ${!canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          Soumettre le formulaire
        </button>
      </div>

      {/* Mobile sticky submit */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-40">
        <div className="mx-4 rounded-xl shadow-lg bg-white border p-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full px-5 py-3 rounded text-white text-base ${!canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            Soumettre le formulaire
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------- UI helpers ---------- */

function Label({ children }) {
  return <label className="text-sm text-gray-700 font-medium">{children}</label>;
}

function Field({ label, input, error, className = '' }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-1">{input}</div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Collapsible card used for big sections on mobile
function SectionCard({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { setOpen(defaultOpen); }, [defaultOpen]);

  return (
    <section className="border rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 rounded-t-xl"
        aria-expanded={open}
      >
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        <span className="text-gray-500">{open ? '▴' : '▾'}</span>
      </button>
      {open && <div className="p-4 sm:p-5">{children}</div>}
    </section>
  );
}

// Image input with thumbnail + filename, mobile friendly
function ImageInput({ file, onChange, ariaLabel }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const inputId = React.useId();

  return (
    <div className="flex items-center gap-2">
      {preview ? (
        <img src={preview} alt="" className="w-12 h-12 rounded object-cover border" />
      ) : (
        <div className="w-12 h-12 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-500">Aperçu</div>
      )}
      <label htmlFor={inputId} className="px-3 py-2 text-xs sm:text-sm rounded border bg-white hover:bg-gray-50 cursor-pointer">
        {file ? 'Changer la photo' : 'Ajouter une photo'}
      </label>
      {file && (
        <button type="button" onClick={() => onChange(null)} className="px-3 py-2 text-xs rounded bg-gray-100 hover:bg-gray-200">
          Effacer
        </button>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="sr-only"
        aria-label={ariaLabel}
      />
    </div>
  );
}

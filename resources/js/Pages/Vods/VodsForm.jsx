import React, { useState } from 'react';

export default function VodsForm() {
  const today = new Date().toLocaleDateString('fr-FR');

  const [header, setHeader] = useState({
    date: '',
    projet: '',
    activite: '',
    observateur: '',
    personnesObservees: '',
    entrepriseObservee: '',
  });

  const [pratiques, setPratiques] = useState([{ text: '', photo: null }]);
  const [comportements, setComportements] = useState([{ text: '', photo: null }]);

  const dangerousConditionsList = [
    "EPI", "Environnement de travail", "Conditions de travail", "Outillage",
    "Procédures et modes opératoires", "Qualifications, habilitation et formation",
    "Inappropriés aux risques", "Housekeeping insatisfaisant", "Mauvaise ergonomie",
    "Mauvais état de conformité", "Non portés correctement", "Gestion de déchets insatisfaisante",
    "Problème d’accessibilité", "Inappropriés aux tâches", "Inadéquats aux tâches",
    "Non appliqués ou appliqués incorrectement", "En mauvais état",
    "Présence de fuites et émanations", "Non utilisés correctement", "Personnel non formé",
    "Personnel non habilité", "Autres"
  ];

  const [conditions, setConditions] = useState({});
  const [correctives, setCorrectives] = useState({});

  const handleFileUpload = (list, setList, index, file) => {
    const updated = [...list];
    updated[index].photo = file;
    setList(updated);
  };

  const handleConditionToggle = (key) => {
    setConditions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCorrectiveChange = (key, field, value) => {
    setCorrectives(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  return (
    <div className="p-8 bg-white shadow-xl rounded-lg max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-gray-800">Visites Observation et ronde HSE</h1>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Date d’émission:</strong> {today}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["date", "projet", "activite", "observateur", "personnesObservees", "entrepriseObservee"].map((field, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            value={header[field]}
            onChange={(e) => setHeader({ ...header, [field]: e.target.value })}
            className="input"
          />
        ))}
      </div>

      <section>
        <h3 className="text-xl font-semibold text-green-600 mb-4">Bonnes pratiques</h3>
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
          </div>
        ))}
        <button onClick={() => setPratiques([...pratiques, { text: '', photo: null }])} className="text-blue-500 hover:underline">+ Ajouter</button>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-red-600 mb-4">Comportements dangereux</h3>
        {comportements.map((item, i) => (
          <div key={i} className="flex gap-3 items-center mb-3">
            <input
              type="text"
              placeholder="Description"
              value={item.text}
              onChange={(e) => {
                const updated = [...comportements];
                updated[i].text = e.target.value;
                setComportements(updated);
              }}
              className="input flex-1"
            />
            <input type="file" onChange={(e) => handleFileUpload(comportements, setComportements, i, e.target.files[0])} />
          </div>
        ))}
        <button onClick={() => setComportements([...comportements, { text: '', photo: null }])} className="text-blue-500 hover:underline">+ Ajouter</button>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-black-600 mb-4">Conditions dangereuses</h3>
        {dangerousConditionsList.map((cond) => (
          <div key={cond} className="flex items-center gap-4 mb-2">
            <input type="checkbox" checked={!!conditions[cond]} onChange={() => handleConditionToggle(cond)} />
            <label className="w-72">{cond}</label>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-green-600 mb-4">Actions correctives</h3>
        {Object.entries(conditions).filter(([_, val]) => val).map(([key]) => (
          <div key={key} className="border-l-4 border-green-500 bg-green-50 p-4 rounded mb-4 shadow-sm">
            <h4 className="font-semibold mb-2 text-gray-800">{key}</h4>
            <input
              type="text"
              placeholder="Action"
              onChange={(e) => handleCorrectiveChange(key, 'action', e.target.value)}
              className="input mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Responsable"
              onChange={(e) => handleCorrectiveChange(key, 'responsable', e.target.value)}
              className="input mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Statut"
              onChange={(e) => handleCorrectiveChange(key, 'statut', e.target.value)}
              className="input mb-2 w-full"
            />
            <input
              type="file"
              onChange={(e) => handleCorrectiveChange(key, 'photo', e.target.files[0])}
              className="mb-2"
            />
          </div>
        ))}
      </section>
    </div>
  );
}

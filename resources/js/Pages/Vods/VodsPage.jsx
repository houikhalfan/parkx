import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import VodsForm from './VodsForm';
import VodsHistory from './VodsHistory';
import VodsNotifications from './VodsNotifications';

export default function VodsPage() {
  const [activeTab, setActiveTab] = useState('form');

  const [historyVods, setHistoryVods] = useState(null);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load history data on first time we open that tab
  useEffect(() => {
    if (activeTab === 'history' && historyVods === null) {
      setLoading(true);
      fetch('/vods/history/data', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(d => setHistoryVods(d.vods || []))
        .finally(() => setLoading(false));
    }
  }, [activeTab, historyVods]);

  // Load notifications data on first time we open that tab
  useEffect(() => {
    if (activeTab === 'notifications' && notif === null) {
      setLoading(true);
      fetch('/vods/notifications/data', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(d => setNotif(d))
        .finally(() => setLoading(false));
    }
  }, [activeTab, notif]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <nav className="flex space-x-4 border-b pb-2">
          <button onClick={() => setActiveTab('form')} className={activeTab === 'form' ? 'font-bold' : ''}>
            Remplir
          </button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'font-bold' : ''}>
            Historique
          </button>
         
        </nav>
      </div>

      {activeTab === 'form' && <VodsForm />}

      {activeTab === 'history' && (
        <>
          {loading && historyVods === null ? (
            <div className="text-gray-500">Chargement…</div>
          ) : (
            <VodsHistory vods={historyVods || []} />
          )}
        </>
      )}

      {activeTab === 'notifications' && (
        <>
          {loading && notif === null ? (
            <div className="text-gray-500">Chargement…</div>
          ) : (
            <VodsNotifications {...(notif || {})} />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import VodsForm from './VodsForm';
import VodsHistory from './VodsHistory';
import VodsNotifications from './VodsNotification';

export default function VodsPage() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <DashboardLayout>
      <div className="mb-6">
        <nav className="flex space-x-4 border-b pb-2">
          <button onClick={() => setActiveTab('form')} className={activeTab === 'form' ? 'font-bold' : ''}>Remplir</button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'font-bold' : ''}>Historique</button>
          <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'font-bold' : ''}>Notifications</button>
        </nav>
      </div>

      {activeTab === 'form' && <VodsForm />}
      {activeTab === 'history' && <VodsHistory />}
      {activeTab === 'notifications' && <VodsNotifications />}
    </DashboardLayout>
  );
}

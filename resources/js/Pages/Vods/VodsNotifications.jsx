import React from 'react';
import { usePage } from '@inertiajs/react';

export default function VodsNotifications() {
  const { vodsToComplete = 0, deadline } = usePage().props;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Notifications VODS</h2>

      {vodsToComplete > 0 ? (
        <div className="bg-yellow-100 text-yellow-900 p-6 rounded shadow">
          <p className="text-lg font-medium">
            ⚠️ Vous devez encore remplir <strong>{vodsToComplete}</strong> VODS avant le <strong>{deadline}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Merci de compléter vos comptes rendus pour respecter vos objectifs mensuels.
          </p>
        </div>
      ) : (
        <div className="bg-green-100 text-green-800 p-6 rounded shadow">
          <p className="text-lg font-medium">✅ Aucun VODS à remplir. Vous êtes à jour !</p>
        </div>
      )}
    </div>
  );
}

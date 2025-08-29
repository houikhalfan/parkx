import React, { useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  // Server props:
  // - isResponsible: boolean
  // - assignedPending: number (pending signature requests for this responsable)
  // - materialPending: number (pending material requests for this responsable)
  const {
    isResponsible = false,
    assignedPending = 0,
    materialPending = 0,
  } = usePage().props || {};

  // Always-visible cards
  const baseCards = useMemo(
    () => [
      {
        title: 'Documents',
        icon: <img src="/images/doc.png" alt="Documents Icon" className="w-16 h-16 mb-4" />,
        href: '/documents',
      },
      {
        title: 'Statistiques',
        icon: <img src="/images/stat.png" alt="Stats Icon" className="w-16 h-16 mb-4" />,
        href: '/stats',
      },
      {
        title: 'VODS',
        icon: <img src="/images/form.png" alt="Video Icon" className="w-16 h-16 mb-4" />,
        href: '/vods',
      },
    ],
    []
  );

  // Responsable-only cards (same style as “Papiers assignés”)
  const responsableCards = useMemo(
    () => [
      {
        title: 'Papiers assignés',
        icon: <img src="/images/agreement.png" alt="Assigned Icon" className="w-16 h-16 mb-4" />,
        href: '/signatures',           // employee.signatures.index
        badge: assignedPending,        // show pending count
      },
      {
        title: 'Ressources matériel',
        icon: <img src="/images/materiel.png" alt="Material Icon" className="w-16 h-16 mb-4" />,
        href: '/materiel',             // employee.materiel.index
        badge: materialPending,        // show pending count
      },
    ],
    [assignedPending, materialPending]
  );

  // Final list
  const cards = useMemo(
    () => (isResponsible ? [...baseCards, ...responsableCards] : baseCards),
    [baseCards, responsableCards, isResponsible]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header background with overlay */}
      <div
        className="h-[50vh] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/p.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-semibold drop-shadow-lg text-center px-4 leading-snug">
            Outils, transparence, collaboration. Bienvenue sur votre interface ParkX.
          </h1>
        </div>
      </div>

      {/* Cards – 3 per row, center leftover row */}
      <div className="relative z-10 -mt-16 px-4 pb-20">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="w-full sm:w-1/2 md:w-1/3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.35 }}
            >
              <Link
                href={card.href}
                className="relative flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 text-center"
              >
                <div className="relative">
                  <div className="text-blue-600 text-5xl mb-4">{card.icon}</div>
                  {typeof card.badge === 'number' && card.badge > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold h-5 min-w-[20px] px-1">
                      {card.badge > 99 ? '99+' : card.badge}
                    </span>
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-800">{card.title}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

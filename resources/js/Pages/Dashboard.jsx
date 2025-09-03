<<<<<<< HEAD
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
=======
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ClipboardList, 
  TrendingUp, 
  Shield, 
  Clock,
  ArrowRight,
  LogOut
} from 'lucide-react';

export default function Dashboard() {
  const cards = [
    {
      title: 'Documents',
      description: 'Gérez et consultez vos documents',
      icon: <FileText className="w-8 h-8" />,
      href: '/documents',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'VODS',
      description: 'Suivez vos obligations de déclaration',
      icon: <ClipboardList className="w-8 h-8" />,
      href: '/vods',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
  ];

  const quickStats = [
    {
      title: 'Documents actifs',
      value: '12',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'VODS à compléter',
      value: '3',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];
>>>>>>> 4b01387 (Documents Complete & Statistiques Without DASH)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with better overlay */}
      <div
<<<<<<< HEAD
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
=======
        className="h-[60vh] bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: "url('/images/p.jpeg')" }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        
        {/* Floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"></div>
        </div>

        {/* Logout Button - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              router.post('/logout');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30 hover:border-white/50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Se déconnecter</span>
          </motion.button>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bienvenue sur ParkX
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Outils, transparence, collaboration. Votre interface de gestion industrielle moderne.
            </p>
            
                         {/* Quick action button */}
             <div className="flex justify-center">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => {
                   document.getElementById('tools-section').scrollIntoView({ 
                     behavior: 'smooth',
                     block: 'start'
                   });
                 }}
                 className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
               >
                 Commencer
               </motion.button>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="relative z-10 -mt-8 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
                     <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

             {/* Main Cards Section */}
       <div id="tools-section" className="px-4 pb-20">
         <div className="max-w-6xl mx-auto">
           {/* Section Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.6 }}
             className="text-center mb-12"
           >
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               Vos outils de travail
             </h2>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Accédez rapidement à vos fonctionnalités principales et gérez vos tâches quotidiennes
             </p>
           </motion.div>

          {/* Enhanced Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  href={card.href}
                  className="block h-full"
                >
                  <div className={`h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group-hover:shadow-2xl`}>
                    {/* Card Header with gradient */}
                    <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-sm`}>
                          {card.icon}
                        </div>
                        <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2" />
                      </div>
                      <h3 className="text-2xl font-bold mt-4 mb-2">{card.title}</h3>
                      <p className="text-white/90 text-sm">{card.description}</p>
                    </div>
                    
                                         {/* Card Body - Simplified */}
                     <div className="p-6">
                       <div className="flex items-center justify-center">
                         <div className={`p-4 rounded-2xl ${card.bgColor} transition-all duration-300 group-hover:scale-110`}>
                           <div className={`${card.iconColor} transition-colors duration-300`}>{card.icon}</div>
                         </div>
                       </div>
                       
                       {/* Simple action text */}
                       <div className="mt-4 text-center">
                         <p className="text-sm text-gray-600 font-medium">
                           Cliquez pour accéder
                         </p>
                       </div>
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sécurité et conformité</h3>
              </div>
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Votre plateforme ParkX respecte les plus hauts standards de sécurité et de conformité. 
                Toutes vos données sont protégées et vos activités sont tracées de manière sécurisée.
              </p>
            </div>
          </motion.div>
>>>>>>> 4b01387 (Documents Complete & Statistiques Without DASH)
        </div>
      </div>
    </div>
  );
}

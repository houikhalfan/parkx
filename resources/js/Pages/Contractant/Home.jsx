import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Package } from 'lucide-react'; // Fallback icon

function CardIcon({ img, size = 40 }) {
  const [broken, setBroken] = React.useState(false);
  return (
    <div className="w-16 h-16 rounded-xl bg-gray-100 grid place-items-center ring-1 ring-black/5 mb-4 group-hover:scale-105 transition">
      {!img || broken ? (
        <Package size={size} className="opacity-80" />
      ) : (
        <img
          src={img}
          alt=""
          className="w-10 h-10 object-contain"
          onError={() => setBroken(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

export default function ContractorHome() {
  const { auth } = usePage().props;
  const name = auth?.contractor?.name ?? auth?.user?.name ?? 'Bienvenue';
=======
import { route } from 'ziggy-js';


export default function ContractorHome() {
const { auth } = usePage().props;
const name = auth?.contractor?.name ?? auth?.user?.name ?? 'Bienvenue';

 const cards = [
  {
    title: 'VODs',
    desc: 'Créer et suivre vos Visites Observation & Ronde.',

   href: '/contractant/vods', // <-- only if you add this route
    img: '/images/form.png',
    accent: 'from-blue-500/10 to-blue-500/0',
  },
  {
    title: 'Documents',
    desc: 'Consulter et télécharger les documents partagés.',
   href: '/contractant/documents',
    img: '/images/doc.png',
    accent: 'from-emerald-500/10 to-emerald-500/0',
  },
  {
    title: 'Statistiques',
    desc: 'Visualiser vos indicateurs clés et progrès.',
   href: route('contractant.statistiques.show'),
    img: '/images/stat.png',
    accent: 'from-amber-500/10 to-amber-500/0',
  },
  {
    title: 'Paraphe & Signature',
    desc: 'Déposez vos pièces pour signature par l\'administration.',
   href: '/contractant/parapheur', // ✅ matches your registered routes
    img: '/images/agreement.png',
    accent: 'from-fuchsia-500/10 to-fuchsia-500/0',
  },
];
>>>>>>> 4b01387 (Documents Complete & Statistiques Without DASH)

  const cards = [
    {
      title: 'VODs',
      desc: 'Créer et suivre vos Visites Observation & Ronde.',
      href: '/contractant/vods',
      img: '/images/form.png',
      accent: 'from-blue-500/10 to-blue-500/0',
    },
    {
      title: 'Documents',
      desc: 'Consulter et télécharger les documents partagés.',
      href: '/contractant/documents',
      img: '/images/doc.png',
      accent: 'from-emerald-500/10 to-emerald-500/0',
    },
    {
      title: 'Statistiques',
      desc: 'Visualiser vos indicateurs clés et progrès.',
      href: '/contractant/statistiques',
      img: '/images/stat.png',
      accent: 'from-amber-500/10 to-amber-500/0',
    },
    {
      title: 'Paraphe & Signature',
      desc: 'Déposez vos pièces pour signature par l’administration.',
      href: '/contractant/parapheur',
      img: '/images/agreement.png',
      accent: 'from-fuchsia-500/10 to-fuchsia-500/0',
    },
    {
      title: 'Ressources Matérielles',
      desc: 'Gérer et suivre l’état de vos engins et équipements.',
      href: route('contractant.materiel.index'),
      img: '/images/materiel.png', // your PNG; fallback shown if missing
      accent: 'from-indigo-500/10 to-indigo-500/0',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm/6 text-white/80">Espace Contractant</p>
              <h1 className="mt-1 text-2xl md:text-4xl font-semibold tracking-tight">
                {name}, accédez à vos services ParkX
              </h1>
              <p className="mt-3 text-white/70 max-w-2xl">
                Outils, transparence, collaboration — tout ce qu'il faut pour avancer rapidement.
              </p>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => router.post(route('contractant.logout'))}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Decorative wave */}
        <svg
          className="absolute bottom-[-1px] left-0 right-0 w-full h-8 text-gray-50"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L48,26.7C96,21,192,11,288,5.3C384,0,480,0,576,10.7C672,21,768,43,864,45.3C960,48,1056,32,1152,26.7C1248,21,1344,27,1392,29.3L1440,32L1440,48L1392,48C1344,48,1248,48,1152,48C1056,48,960,48,864,48C768,48,672,48,576,48C480,48,384,48,288,48C192,48,96,48,48,48L0,48Z"
          />
        </svg>
      </div>

      {/* Cards */}
      <main className="max-w-6xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="h-full"
            >
              <Link
                href={card.href}
                className="group relative block h-full rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${card.accent} pointer-events-none`} />
                <div className="p-5 h-full flex flex-col items-center text-center">
                  <CardIcon img={card.img} />
                  {/* Bigger title, with fixed min-height to keep rows aligned */}
                  <div className="text-[1.1rem] md:text-lg font-semibold text-gray-900 min-h-[52px] flex items-center justify-center">
                    {card.title}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 min-h-[48px]">
                    {card.desc}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-blue-600 pt-4">
                    Ouvrir
                    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                      <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick help */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white border p-5">
<<<<<<< HEAD
            <h3 className="font-semibold text-[1.05rem] md:text-lg">Notifications</h3>
            <p className="mt-2 text-sm text-gray-600">Vos alertes et messages importants s’affichent ici.</p>
=======
            <h3 className="font-semibold">Notifications</h3>
            <p className="mt-2 text-sm text-gray-600">Vos alertes et messages importants s'affichent ici.</p>
>>>>>>> 4b01387 (Documents Complete & Statistiques Without DASH)
          </div>
          <div className="rounded-2xl bg-white border p-5">
            <h3 className="font-semibold text-[1.05rem] md:text-lg">Contacts</h3>
            <p className="mt-2 text-sm text-gray-600">
              Administration ParkX — <a href="mailto:admin@parkx.test" className="text-blue-600">admin@parkx.test</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

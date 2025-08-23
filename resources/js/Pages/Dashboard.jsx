// resources/js/Pages/Dashboard.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const cards = [
    {
      title: "Documents",
      icon: <img src="/images/doc.png" alt="Documents Icon" className="w-16 h-16 mb-4" />,
      href: "/documents",
    },
    {
      title: "Statistiques",
      icon: <img src="/images/stat.png" alt="Stats Icon" className="w-16 h-16 mb-4" />,
      // ✅ send contractors to the form
      href: (typeof route === "function"
        ? route("contractor.stats.create")
        : "/contractor/stats/new"),
    },
    {
      title: "VODS",
      icon: <img src="/images/form.png" alt="Video Icon" className="w-16 h-16 mb-4" />,
      href: (typeof route === "function" ? route("vods.form") : "/vods/form"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="relative z-10 -mt-16 px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
            >
              <Link
                href={card.href}
                className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 text-center"
              >
                <div className="text-blue-600 text-5xl mb-4">{card.icon}</div>
                <div className="text-lg font-semibold text-gray-800">{card.title}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

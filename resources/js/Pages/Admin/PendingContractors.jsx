import React from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';

function PendingContractors({ pendingContractors, csrf_token }) {
  const handleApprove = (contractorId) => {
    if (confirm('Êtes-vous sûr de vouloir approuver ce contractant ?')) {
      router.post(route('admin.contractors.approve', contractorId), {}, {
        preserveScroll: true,
        onSuccess: () => {
          // Refresh the page to show updated list
          router.reload();
        }
      });
    }
  };

  const handleReject = (contractorId) => {
    if (confirm('Êtes-vous sûr de vouloir rejeter ce contractant ? Cette action est irréversible.')) {
      router.post(route('admin.contractors.reject', contractorId), {}, {
        preserveScroll: true,
        onSuccess: () => {
          // Refresh the page to show updated list
          router.reload();
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Contractants en attente d'approbation
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les demandes d'inscription des contractants
              </p>
            </div>
            <Link
              href={route('admin.home')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau d'administration
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingContractors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contractant en attente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tous les contractants ont été traités.
            </p>
          </motion.div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pendingContractors.map((contractor, index) => (
                <motion.li
                  key={contractor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {contractor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {contractor.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {contractor.email}
                          </p>
                          {contractor.company_name && (
                            <p className="text-xs text-gray-400 truncate">
                              🏢 {contractor.company_name}
                            </p>
                          )}
                          {contractor.phone && (
                            <p className="text-xs text-gray-400 truncate">
                              📞 {contractor.phone}
                            </p>
                          )}
                          {contractor.role && (
                            <p className="text-xs text-gray-400 truncate">
                              👷 {contractor.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500">
                        Demande le {new Date(contractor.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <button
                        onClick={() => handleApprove(contractor.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        ✅ Approuver
                      </button>
                      <button
                        onClick={() => handleReject(contractor.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        ❌ Rejeter
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

PendingContractors.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default PendingContractors;

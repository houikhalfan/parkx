import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ContractantLayout from '../../ContractantLayout';

export default function ContractorStatisticsHistory({ records }) {
    const [stats, setStats] = useState(records || []);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(route('contractant.statistiques.history'), {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const data = await response.json();
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') return '0';
        return parseFloat(value).toFixed(2);
    };

    return (
        <ContractantLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Historique des Statistiques</h1>
                                <p className="mt-1 text-sm text-gray-500">Consultez vos statistiques HSE enregistrées</p>
                            </div>
                            <div className="flex space-x-3">
                                <Link href={route('contractant.statistiques.show')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Nouvelle statistique
                                </Link>
                                <Link href={route('contractant.home')} className="text-sm text-gray-600 hover:text-gray-900 underline">
                                    ← Retour
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <Link href={route('contractant.statistiques.show')} className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Remplir
                        </Link>
                        <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Historique
                        </a>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Refresh Button */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Vos statistiques HSE</h2>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Actualisation...
                            </>
                        ) : (
                            <>
                                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualiser
                            </>
                        )}
                    </button>
                </div>

                {/* Statistics Table */}
                {stats.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow rounded-lg p-8 text-center"
                    >
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune statistique</h3>
                        <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore enregistré de statistiques HSE.</p>
                        <div className="mt-6">
                            <Link href={route('contractant.statistiques.show')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                Créer votre première statistique
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow overflow-hidden sm:rounded-md"
                    >
                        <ul className="divide-y divide-gray-200">
                            {stats.map((stat, index) => (
                                <motion.li
                                    key={stat.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="px-6 py-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {stat.site} - {formatDate(stat.date)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Créé le {formatDate(stat.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{formatNumber(stat.total_heures)}</span>
                                                <span className="text-xs">Total heures</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{formatNumber(stat.trir)}</span>
                                                <span className="text-xs">TRIR</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{formatNumber(stat.ltir)}</span>
                                                <span className="text-xs">LTIR</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{formatNumber(stat.dart)}</span>
                                                <span className="text-xs">DART</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{stat.permis_total || 0}</span>
                                                <span className="text-xs">Permis</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-medium text-gray-900">{stat.inspections_total_hse || 0}</span>
                                                <span className="text-xs">Inspections</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
        </ContractantLayout>
    );
}

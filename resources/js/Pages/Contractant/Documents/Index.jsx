import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Download, Eye, FileText, Globe, Calendar, User } from 'lucide-react';
import ContractantLayout from '../../ContractantLayout';

export default function ContractantDocumentsIndex({ documents, flash }) {
    const getFileIcon = (fileType) => {
        const type = fileType.toLowerCase();
        if (type === 'pdf') {
            return <FileText className="w-8 h-8 text-red-500" />;
        } else if (['doc', 'docx'].includes(type)) {
            return <FileText className="w-8 h-8 text-blue-500" />;
        }
        return <FileText className="w-8 h-8 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <ContractantLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Link
                                    href={route('contractant.home')}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour à l'accueil
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold text-gray-900">Documents Partagés</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Documents Partagés
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Consultez et téléchargez les documents partagés par l'administration ParkX.
                            Ces documents sont accessibles à tous les entrepreneurs.
                        </p>
                    </div>

                    {/* Documents Grid */}
                    {documents.length === 0 ? (
                        <div className="text-center py-12">
                            <Globe className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document partagé</h3>
                            <p className="text-gray-500">
                                Aucun document partagé n'est disponible pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((document) => (
                                <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    {/* Document Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-start gap-4">
                                            {getFileIcon(document.file_type)}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {document.title}
                                                </h3>
                                                {document.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {document.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Info */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Fichier:</span>
                                            <span className="font-medium text-gray-900">{document.original_filename}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Type:</span>
                                            <span className="font-medium text-gray-900">{document.file_type.toUpperCase()}</span>
                                        </div>
                                        {document.file_size && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Taille:</span>
                                                <span className="font-medium text-gray-900">{formatFileSize(document.file_size)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Ajouté le:</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(document.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Par:</span>
                                            <span className="font-medium text-gray-900">{document.full_name || document.admin?.name || 'Admin'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                                        <div className="flex items-center gap-3">
                                                                                    <Link
                                            href={route('contractant.contractor-docs.show', document.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Voir les détails
                                        </Link>
                                        <a
                                            href={route('contractant.contractor-docs.download', document.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="w-4 h-4" />
                                            Télécharger
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ContractantLayout>
    );
}

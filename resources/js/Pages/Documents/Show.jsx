import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Globe, Calendar, User } from 'lucide-react';

export default function PublicDocumentShow({ document, flash }) {
    const getFileIcon = () => {
        const fileType = document.file_type.toLowerCase();
        if (fileType === 'pdf') {
            return <FileText className="w-16 h-16 text-red-500" />;
        } else if (['doc', 'docx'].includes(fileType)) {
            return <FileText className="w-16 h-16 text-blue-500" />;
        }
        return <FileText className="w-16 h-16 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                                                            <Link
                                    href={route('parkx.documents.index')}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour aux documents
                                </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold text-gray-900">Détails du Document</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Document Details */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Document Header */}
                    <div className="px-6 py-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            {getFileIcon()}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {document.title}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Par {document.full_name || document.admin?.name || 'Admin'}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* Document Information */}
                    <div className="px-6 py-6 space-y-6">
                        {/* Description */}
                        {document.description && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {document.description}
                                </p>
                            </div>
                        )}

                        {/* File Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Informations du fichier</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Nom du fichier :</span>
                                    <span className="font-medium text-gray-900">{document.original_filename}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Type de fichier :</span>
                                    <span className="font-medium text-gray-900">{document.file_type.toUpperCase()}</span>
                                </div>
                                {document.file_size && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Taille du fichier :</span>
                                        <span className="font-medium text-gray-900">{formatFileSize(document.file_size)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Date de création :</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(document.created_at).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Dernière modification :</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(document.updated_at).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>



                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <a
                                    href={route('parkx.documents.download', document.id)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="w-5 h-5" />
                                    Télécharger le document
                                </a>
                                <Link
                                    href={route('parkx.documents.index')}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Retour à la liste
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

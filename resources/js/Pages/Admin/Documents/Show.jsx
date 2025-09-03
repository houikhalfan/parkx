import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Download, Trash2, FileText, Lock, Globe, Calendar, User } from 'lucide-react';

export default function ShowDocument({ document, flash }) {
    // Debug logging
    console.log('ShowDocument component rendered with:', { document, flash });
    
    // Check if document exists
    if (!document) {
        console.error('Document prop is missing or null');
        return (
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Erreur: Document non trouvé
                    </div>
                </div>
            </AdminLayout>
        );
    }
    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            router.delete(route('admin.documents.destroy', document.id));
        }
    };

    const getVisibilityIcon = (visibility) => {
        return visibility === 'private' ? (
            <Lock className="w-6 h-6 text-red-500" />
        ) : (
            <Globe className="w-6 h-6 text-green-500" />
        );
    };

    const getVisibilityLabel = (visibility) => {
        return visibility === 'private' ? 'Privé' : 'Public';
    };

    const getVisibilityBadgeClass = (visibility) => {
        return visibility === 'private' 
            ? 'bg-red-100 text-red-800 border-red-200' 
            : 'bg-green-100 text-green-800 border-green-200';
    };

    const getFileIcon = () => {
        const fileType = document.file_type.toLowerCase();
        if (fileType === 'pdf') {
            return <FileText className="w-16 h-16 text-red-500" />;
        } else if (['doc', 'docx'].includes(fileType)) {
            return <FileText className="w-16 h-16 text-blue-500" />;
        }
        return <FileText className="w-16 h-16 text-gray-500" />;
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={route('admin.documents.index')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux documents
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.documents.download', document.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                        </button>
                    </div>
                </div>

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
                            <div className="flex items-center gap-2">
                                {getVisibilityIcon(document.visibility)}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getVisibilityBadgeClass(document.visibility)}`}>
                                    {getVisibilityLabel(document.visibility)}
                                </span>
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
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Chemin de stockage :</span>
                                    <span className="font-medium text-gray-900 font-mono text-sm">{document.file_path}</span>
                                </div>
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

                        {/* Visibility Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Informations de visibilité</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    {getVisibilityIcon(document.visibility)}
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {getVisibilityLabel(document.visibility)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {document.visibility === 'private' 
                                                ? 'Ce document n\'est visible que par les administrateurs du système.'
                                                : 'Ce document est visible par tous les utilisateurs du système.'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

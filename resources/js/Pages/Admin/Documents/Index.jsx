import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Download, Eye, Trash2, FileText, Lock, Globe } from 'lucide-react';

export default function DocumentsIndex({ documents, flash }) {
    // Debug logging
    console.log('DocumentsIndex component rendered with:', { documents, flash });
    
    // Log each document for debugging
    if (documents && documents.length > 0) {
        documents.forEach((doc, index) => {
            console.log(`Document ${index}:`, doc);
        });
    }
    const handleDelete = (documentId) => {
        console.log('Deleting document:', documentId);
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            const deleteUrl = route('admin.documents.destroy', documentId);
            console.log('Delete URL:', deleteUrl);
            
            router.delete(deleteUrl, {
                onSuccess: () => {
                    console.log('Document deleted successfully');
                    // Document will be removed from the list automatically
                },
                onError: (errors) => {
                    console.error('Error deleting document:', errors);
                    alert('Erreur lors de la suppression du document. Veuillez réessayer.');
                }
            });
        }
    };

    const handleDownload = (documentId, filename) => {
        console.log('Downloading document:', documentId, filename);
        // Create a temporary link to trigger download
        const downloadUrl = route('admin.documents.download', documentId);
        console.log('Download URL:', downloadUrl);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getVisibilityIcon = (visibility) => {
        return visibility === 'private' ? (
            <Lock className="w-4 h-4 text-red-500" />
        ) : (
            <Globe className="w-4 h-4 text-green-500" />
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

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Documents</h1>
                        <p className="text-gray-600 mt-1">Gérez les documents privés et publics du système</p>
                    </div>
                    <Link
                        href={route('admin.documents.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un document
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Documents Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Liste des Documents</h2>
                    </div>
                    
                    {documents.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Commencez par ajouter votre premier document.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.documents.create')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un document
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Document
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Visibilité
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ajouté par
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date d'ajout
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents.map((document) => (
                                        <tr key={document.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText className="w-8 h-8 text-blue-500 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {document.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {document.original_filename}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {document.file_type.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {document.description || 'Aucune description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getVisibilityIcon(document.visibility)}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVisibilityBadgeClass(document.visibility)}`}>
                                                        {getVisibilityLabel(document.visibility)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {document.full_name || document.admin?.name || 'Admin'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(document.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('admin.documents.show', document.id)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                                                        title="Voir les détails"
                                                        onClick={() => console.log('Viewing document:', document.id, 'URL:', route('admin.documents.show', document.id))}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDownload(document.id, document.original_filename)}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                                                        title="Télécharger"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(document.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Upload, FileText, Lock, Globe } from 'lucide-react';

export default function CreateDocument() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'private'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Veuillez sélectionner un fichier PDF, DOC ou DOCX valide.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            
            // Check file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                alert('Le fichier est trop volumineux. Taille maximum : 10MB.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier.');
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('visibility', formData.visibility);
        data.append('document', selectedFile);

        router.post(route('admin.documents.store'), data, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error('Validation errors:', errors);
            }
        });
    };

    const getFileIcon = () => {
        if (!selectedFile) return <FileText className="w-12 h-12 text-gray-400" />;
        
        const fileType = selectedFile.type;
        if (fileType === 'application/pdf') {
            return <FileText className="w-12 h-12 text-red-500" />;
        } else if (fileType.includes('word')) {
            return <FileText className="w-12 h-12 text-blue-500" />;
        }
        return <FileText className="w-12 h-12 text-gray-500" />;
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href={route('admin.documents.index')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux documents
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-900">Ajouter un nouveau document</h1>
                        <p className="text-gray-600 mt-1">Téléchargez un document et définissez sa visibilité</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Titre du document *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Entrez le titre du document"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Description optionnelle du document"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fichier à télécharger *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {getFileIcon()}
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="document"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Télécharger un fichier</span>
                                            <input
                                                id="document"
                                                name="document"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="sr-only"
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">ou glisser-déposer</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX jusqu'à 10MB
                                    </p>
                                    {selectedFile && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                            <p className="text-sm text-blue-800">
                                                <strong>Fichier sélectionné:</strong> {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-blue-600">
                                                Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Visibilité du document *
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={formData.visibility === 'private'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-3 flex items-center">
                                        <Lock className="w-5 h-5 text-red-500 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Privé</div>
                                            <div className="text-sm text-gray-500">Seuls les administrateurs peuvent voir ce document</div>
                                        </div>
                                    </div>
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={formData.visibility === 'public'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-3 flex items-center">
                                        <Globe className="w-5 h-5 text-green-500 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Public</div>
                                            <div className="text-sm text-gray-500">Tous les utilisateurs peuvent voir ce document</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href={route('admin.documents.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedFile}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                                        Téléchargement...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Ajouter le document
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

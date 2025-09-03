import React from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, FileText } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DocumentEdit({ document }) {
  const { data, setData, put, processing, errors } = useForm({
    title: document.title || '',
    description: document.description || '',
    visibility: document.visibility || 'private',
    category: document.category || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.documents.update', document.id));
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={route('admin.documents.index')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Document</h1>
              <p className="text-gray-600">Update document information and settings</p>
            </div>
          </div>
        </div>

        {/* Current File Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📎</span>
            <div>
              <div className="font-medium text-gray-900">{document.original_filename}</div>
              <div className="text-sm text-gray-500">File cannot be changed</div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                id="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter document title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter document description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={data.category}
                onChange={(e) => setData('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Procedures, Manuals, Forms"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility *
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={data.visibility === 'private'}
                    onChange={(e) => setData('visibility', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <EyeOff className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Private</div>
                      <div className="text-sm text-gray-500">Only administrators can access</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={data.visibility === 'public'}
                    onChange={(e) => setData('visibility', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <Eye className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Public</div>
                      <div className="text-sm text-gray-500">All users (ParkX members and contractors) can access</div>
                    </div>
                  </div>
                </label>
              </div>
              {errors.visibility && (
                <p className="mt-1 text-sm text-red-600">{errors.visibility}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Link
                href={route('admin.documents.index')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {processing ? 'Updating...' : 'Update Document'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <FileText className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-1">Editing Guidelines</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• You can update the title, description, category, and visibility</li>
                <li>• The original file cannot be changed</li>
                <li>• Public documents are accessible to all users</li>
                <li>• Private documents are only visible to administrators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

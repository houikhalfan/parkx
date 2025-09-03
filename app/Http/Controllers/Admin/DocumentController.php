<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents
     */
    public function index()
    {
        try {
            $documents = Document::with('admin')
                ->orderBy('created_at', 'desc')
                ->get();

            \Log::info('Documents index requested', [
                'count' => $documents->count(),
                'admin_id' => session('admin_id')
            ]);

            return Inertia::render('Admin/Documents/Index', [
                'documents' => $documents
            ]);
        } catch (\Exception $e) {
            \Log::error('Documents index failed', [
                'error' => $e->getMessage()
            ]);
            abort(500, 'Erreur lors du chargement des documents: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new document
     */
    public function create()
    {
        return Inertia::render('Admin/Documents/Create');
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'visibility' => 'required|in:private,public'
        ]);

        $file = $request->file('document');
        $originalFilename = $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $fileExtension;
        
        // Store file in storage/app/public/documents
        $filePath = $file->storeAs('documents', $filename, 'public');

        // Get admin's full name
        $admin = \App\Models\Admin::find(session('admin_id'));
        $adminFullName = $admin ? $admin->name : 'Admin Inconnu';

        $document = Document::create([
            'title' => $request->title,
            'description' => $request->description,
            'filename' => $filename,
            'original_filename' => $originalFilename,
            'file_path' => $filePath,
            'file_type' => $fileExtension,
            'file_size' => $file->getSize(),
            'visibility' => $request->visibility,
            'admin_id' => session('admin_id'),
            'full_name' => $adminFullName
        ]);

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document ajouté avec succès.');
    }

    /**
     * Display the specified document
     */
    public function show(Document $document)
    {
        try {
            \Log::info('Document view requested', [
                'document_id' => $document->id,
                'admin_id' => session('admin_id')
            ]);

            // Load the document with admin relationship
            $documentWithAdmin = $document->load('admin');
            
            \Log::info('Document data loaded', [
                'document' => $documentWithAdmin->toArray()
            ]);

            return Inertia::render('Admin/Documents/Show', [
                'document' => $documentWithAdmin
            ]);
        } catch (\Exception $e) {
            \Log::error('Document view failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            abort(500, 'Erreur lors de l\'affichage du document: ' . $e->getMessage());
        }
    }

    /**
     * Download the document
     */
    public function download(Document $document)
    {
        try {
            // Check if user has access to this document
            if ($document->visibility === 'private' && !session('admin_id')) {
                abort(403, 'Accès non autorisé');
            }

            $filePath = storage_path('app/public/' . $document->file_path);
            
            if (!file_exists($filePath)) {
                abort(404, 'Fichier non trouvé: ' . $filePath);
            }

            // Log the download attempt
            \Log::info('Document download requested', [
                'document_id' => $document->id,
                'filename' => $document->original_filename,
                'file_path' => $filePath,
                'admin_id' => session('admin_id')
            ]);

            return response()->download($filePath, $document->original_filename);
        } catch (\Exception $e) {
            \Log::error('Document download failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage()
            ]);
            abort(500, 'Erreur lors du téléchargement: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified document
     */
    public function destroy(Document $document)
    {
        try {
            \Log::info('Document deletion requested', [
                'document_id' => $document->id,
                'filename' => $document->original_filename,
                'admin_id' => session('admin_id')
            ]);

            // Delete file from storage
            if (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
                \Log::info('File deleted from storage', ['file_path' => $document->file_path]);
            } else {
                \Log::warning('File not found in storage', ['file_path' => $document->file_path]);
            }

            $document->delete();
            \Log::info('Document deleted from database', ['document_id' => $document->id]);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document supprimé avec succès.');
        } catch (\Exception $e) {
            \Log::error('Document deletion failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('admin.documents.index')
                ->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractantDocumentController extends Controller
{
    /**
     * Display a listing of public documents for contractors
     */
    public function index()
    {
        $documents = Document::with('admin')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Contractant/Documents/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Display the specified public document
     */
    public function show(Document $document)
    {
        // Ensure only public documents can be viewed
        if ($document->visibility !== 'public') {
            abort(404, 'Document non trouvé');
        }

        return Inertia::render('Contractant/Documents/Show', [
            'document' => $document->load('admin')
        ]);
    }

    /**
     * Download a public document
     */
    public function download(Document $document)
    {
        // Ensure only public documents can be downloaded
        if ($document->visibility !== 'public') {
            abort(403, 'Accès non autorisé');
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        
        // Log for debugging
        \Log::info('Contractor download attempt', [
            'document_id' => $document->id,
            'title' => $document->title,
            'file_path' => $document->file_path,
            'full_path' => $filePath,
            'exists' => file_exists($filePath),
            'visibility' => $document->visibility
        ]);
        
        if (!file_exists($filePath)) {
            \Log::error('File not found for contractor download', ['file_path' => $filePath]);
            abort(404, 'Fichier non trouvé');
        }

        // Try to get file info
        $fileInfo = pathinfo($filePath);
        $mimeType = mime_content_type($filePath);
        
        \Log::info('File info for contractor', [
            'mime_type' => $mimeType,
            'file_size' => filesize($filePath)
        ]);

        try {
            return response()->download($filePath, $document->original_filename, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $document->original_filename . '"'
            ]);
        } catch (\Exception $e) {
            \Log::error('Contractor download error', [
                'error' => $e->getMessage(),
                'file_path' => $filePath
            ]);
            abort(500, 'Erreur lors du téléchargement: ' . $e->getMessage());
        }
    }
}

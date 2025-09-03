<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
    /**
     * Display a listing of documents
     */
    public function index(): Response
    {
        $documents = Document::with('admin')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'description' => $document->description,
                    'filename' => $document->filename,
                    'original_filename' => $document->original_filename,
                    'file_type' => $document->file_type,
                    'file_size' => $document->formatted_file_size,
                    'visibility' => $document->visibility,
                    'category' => $document->category,
                    'admin_name' => $document->admin->name ?? 'Unknown',
                    'created_at' => $document->created_at_formatted,
                    'file_icon' => $document->file_icon,
                    'download_url' => $document->download_url,
                ];
            });

        $stats = [
            'total' => Document::count(),
            'public' => Document::where('visibility', 'public')->count(),
            'private' => Document::where('visibility', 'private')->count(),
        ];

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new document
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Documents/Create');
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'visibility' => 'required|in:public,private',
            'category' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $file = $request->file('document');
            $originalFilename = $file->getClientOriginalName();
            $filename = time() . '_' . $originalFilename;
            $filePath = $file->storeAs('documents', $filename, 'private');

            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'filename' => $filename,
                'original_filename' => $originalFilename,
                'file_path' => $filePath,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'visibility' => $request->visibility,
                'category' => $request->category,
                'admin_id' => session('admin_id'),
                'meta' => [
                    'uploaded_by' => session('admin_id'),
                    'upload_date' => now()->toISOString(),
                ],
            ]);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document uploaded successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['document' => 'Failed to upload document. Please try again.'])->withInput();
        }
    }

    /**
     * Display the specified document
     */
    public function show(Document $document): Response
    {
        $document->load('admin');
        
        return Inertia::render('Admin/Documents/Show', [
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'description' => $document->description,
                'filename' => $document->filename,
                'original_filename' => $document->original_filename,
                'file_type' => $document->file_type,
                'file_size' => $document->formatted_file_size,
                'visibility' => $document->visibility,
                'category' => $document->category,
                'admin_name' => $document->admin->name ?? 'Unknown',
                'created_at' => $document->created_at_formatted,
                'updated_at' => $document->updated_at->format('d/m/Y H:i'),
                'file_icon' => $document->file_icon,
                'download_url' => $document->download_url,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified document
     */
    public function edit(Document $document): Response
    {
        return Inertia::render('Admin/Documents/Edit', [
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'description' => $document->description,
                'visibility' => $document->visibility,
                'category' => $document->category,
                'original_filename' => $document->original_filename,
            ],
        ]);
    }

    /**
     * Update the specified document
     */
    public function update(Request $request, Document $document)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'visibility' => 'required|in:public,private',
            'category' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $document->update([
            'title' => $request->title,
            'description' => $request->description,
            'visibility' => $request->visibility,
            'category' => $request->category,
        ]);

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document updated successfully!');
    }

    /**
     * Remove the specified document
     */
    public function destroy(Document $document)
    {
        try {
            $document->delete();
            return redirect()->route('admin.documents.index')
                ->with('success', 'Document deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete document. Please try again.']);
        }
    }

    /**
     * Download the specified document
     */
    public function download(Document $document)
    {
        if (!Storage::exists($document->file_path)) {
            abort(404, 'File not found');
        }

        return Storage::download($document->file_path, $document->original_filename);
    }

    /**
     * Toggle document visibility
     */
    public function toggleVisibility(Document $document)
    {
        $newVisibility = $document->visibility === 'public' ? 'private' : 'public';
        $document->update(['visibility' => $newVisibility]);

        return back()->with('success', "Document visibility changed to {$newVisibility}");
    }
}

<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\SignatureRequest;
use App\Models\SignatureRequestComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SignatureRequestController extends Controller
{
    public function index(Request $request)
    {
        $contractor = auth('contractor')->user();

        $pending = SignatureRequest::where('contractor_id', $contractor->id)
            ->where('status', 'pending')
            ->orderByDesc('created_at')->get();

        $signed = SignatureRequest::where('contractor_id', $contractor->id)
            ->where('status', 'signed')
            ->orderByDesc('signed_at')->get();

        $rejected = SignatureRequest::where('contractor_id', $contractor->id)
            ->where('status', 'rejected')
            ->orderByDesc('rejected_at')->get();

        return Inertia::render('Contractant/Parapheur/Index', [
            'pending'  => $pending,
            'signed'   => $signed,
            'rejected' => $rejected,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        $contractor = auth('contractor')->user();

        $validated = $request->validate([
            'title'   => ['required','string','max:255'],
            'message' => ['nullable','string','max:2000'],
            'file'    => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
        ]);

        $path = $request->file('file')->store('signatures/originals', 'public');

        $sr = SignatureRequest::create([
            'contractor_id' => $contractor->id,
            'title'         => $validated['title'],
            'message'       => $validated['message'] ?? null,
            'original_path' => $path,
            'status'        => 'pending',
        ]);

        return redirect()->route('contractant.parapheur.show', $sr->id)
            ->with('success', 'Fichier envoyé. En attente de signature.');
    }

    public function show(Request $request, $id)
    {
        $contractor = auth('contractor')->user();

        $sr = SignatureRequest::with(['admin:id,name', 'requestComments.author'])
            ->where('contractor_id', $contractor->id)
            ->findOrFail($id);

        return Inertia::render('Contractant/Parapheur/Show', [
            'req'  => $sr,
            'can_download_signed' => filled($sr->signed_path),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function downloadOriginal($id)
    {
        $contractor = auth('contractor')->user();
        $sr = SignatureRequest::where('contractor_id', $contractor->id)->findOrFail($id);

        return Storage::disk('public')->download($sr->original_path);
    }

    public function downloadSigned($id)
    {
        $contractor = auth('contractor')->user();
        $sr = SignatureRequest::where('contractor_id', $contractor->id)->findOrFail($id);

        abort_unless($sr->signed_path, 404);
        return Storage::disk('public')->download($sr->signed_path);
    }

    public function comment(Request $request, $id)
    {
        $contractor = auth('contractor')->user();

        $sr = SignatureRequest::where('contractor_id', $contractor->id)->findOrFail($id);

        $data = $request->validate(['body' => ['required','string','max:4000']]);

        SignatureRequestComment::create([
            'signature_request_id' => $sr->id,
            'author_type' => \App\Models\Contractor::class,
            'author_id'   => $contractor->id,
            'body'        => $data['body'],
        ]);

        return back()->with('success', 'Commentaire ajouté.');
    }
}

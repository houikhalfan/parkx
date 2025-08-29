<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\SignatureRequest;
use App\Models\SignatureRequestComment;
use App\Models\Site;
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

        // sites pour le <select> dans le modal
        $sites = Site::orderBy('name')->get(['id','name']);

        return Inertia::render('Contractant/Parapheur/Index', [
            'pending'     => $pending,
            'signed'      => $signed,
            'rejected'    => $rejected,
            'counts'      => [
                'pending'  => $pending->count(),
                'signed'   => $signed->count(),
                'rejected' => $rejected->count(),
            ],
            'sites'       => $sites,
            'csrf_token'  => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        $contractor = auth('contractor')->user();

        $validated = $request->validate([
            'title'   => ['required','string','max:255'],
            'message' => ['nullable','string','max:2000'],
            'file'    => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
            'site_id' => ['required','integer','exists:sites,id'],
        ]);

        $site = Site::findOrFail($validated['site_id']);

        $path = $request->file('file')->store('signatures/originals', 'public');

        SignatureRequest::create([
            'contractor_id'    => $contractor->id,
            'site_id'          => $site->id,                       // ✅ site lié
            'assigned_user_id' => $site->responsible_user_id,      // ✅ assigné au responsable
            'title'            => $validated['title'],
            'message'          => $validated['message'] ?? null,
            'original_path'    => $path,
            'status'           => 'pending',
        ]);

        // SweetAlert côté client
        return redirect()
            ->route('contractant.parapheur.index')
            ->with('swal', [
                'title' => 'Merci !',
                'text'  => 'Votre demande a été envoyée au responsable du site.',
                'icon'  => 'success',
            ]);
    }

    public function show(Request $request, $id)
    {
        $contractor = auth('contractor')->user();

        $sr = SignatureRequest::with(['admin:id,name', 'requestComments.author', 'site:id,name'])
            ->where('contractor_id', $contractor->id)
            ->findOrFail($id);

        return Inertia::render('Contractant/Parapheur/Show', [
            'req'                 => $sr,
            'can_download_signed' => filled($sr->signed_path),
            'csrf_token'          => csrf_token(),
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
            'author_type'          => \App\Models\Contractor::class,
            'author_id'            => $contractor->id,
            'body'                 => $data['body'],
        ]);

        return back()->with('swal', [
            'title' => 'Commentaire ajouté',
            'icon'  => 'success',
        ]);
    }
}

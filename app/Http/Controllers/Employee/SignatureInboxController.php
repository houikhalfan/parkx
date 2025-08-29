<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\SignatureRequest;
use App\Models\SignatureRequestComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SignatureInboxController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); // ParkX employee
        $q = (string) $request->query('q', '');
        $s = (string) $request->query('s', '');

        $items = SignatureRequest::with(['contractor:id,name,email'])
            ->where('assigned_user_id', $user->id)
            ->when(strlen($q) > 0, function ($qb) use ($q) {
                $like = '%'.$q.'%';
                $qb->where(function ($inner) use ($like) {
                    $inner->where('title', 'like', $like)
                          ->orWhereHas('contractor', function ($cq) use ($like) {
                              $cq->where('name', 'like', $like)
                                 ->orWhere('email', 'like', $like);
                          });
                });
            })
            ->when(in_array($s, ['pending','signed','rejected']), fn($qb) => $qb->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Employee/Signatures/Index', [
            'items' => $items,
            'q'     => $q,
            's'     => $s,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $req = SignatureRequest::with([
                'contractor:id,name,email',
                'requestComments' => fn($q) => $q->orderBy('created_at'),
            ])
            ->where('assigned_user_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('Employee/Signatures/Show', [
            'req'        => $req,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function downloadOriginal(Request $request, int $id)
    {
        $user = $request->user();

        $req = SignatureRequest::where('assigned_user_id', $user->id)->findOrFail($id);
        abort_unless($req->original_path, 404);

        return Storage::disk('public')->download($req->original_path);
    }

    public function approve(Request $request, int $id)
    {
        $user = $request->user();

        $sr = SignatureRequest::where('assigned_user_id', $user->id)->findOrFail($id);

        $data = $request->validate([
            'signed_file' => ['required','file','mimes:pdf','max:10240'],
            'comment'     => ['nullable','string','max:2000'],
        ]);

        $path = $request->file('signed_file')->store('signatures/signed', 'public');

        $sr->update([
            'status'     => 'signed',
            'signed_path'=> $path,
            'signed_at'  => now(),
        ]);

        if (!empty($data['comment'])) {
            SignatureRequestComment::create([
                'signature_request_id' => $sr->id,
                'author_type'          => \App\Models\User::class,
                'author_id'            => $user->id,
                'body'                 => $data['comment'],
            ]);
        }

        // Return a normal Inertia redirect; React will show SweetAlert then route back.
        return back(303);
    }

    public function reject(Request $request, int $id)
    {
        $user = $request->user();

        $sr = SignatureRequest::where('assigned_user_id', $user->id)->findOrFail($id);

        $data = $request->validate([
            'reason' => ['required','string','max:2000'],
        ]);

        $sr->update([
            'status'      => 'rejected',
            'rejected_at' => now(),
        ]);

        SignatureRequestComment::create([
            'signature_request_id' => $sr->id,
            'author_type'          => \App\Models\User::class,
            'author_id'            => $user->id,
            'body'                 => $data['reason'],
        ]);

        return back(303);
    }
}

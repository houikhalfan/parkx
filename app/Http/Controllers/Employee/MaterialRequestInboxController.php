<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\MaterialRequest as MR;

class MaterialRequestInboxController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $q = (string) $request->query('q', '');
        $s = (string) $request->query('s', '');

        $items = MR::with(['contractor:id,name,email', 'site:id,name'])
            ->where('assigned_user_id', $user->id)
            ->when(strlen($q) > 0, function ($qb) use ($q) {
                $like = '%'.$q.'%';
                $qb->where(function ($inner) use ($like) {
                    $inner
                        ->orWhereHas('site', fn ($sq) => $sq->where('name', 'like', $like))
                        ->orWhereHas('contractor', fn ($cq) => $cq->where('name', 'like', $like)
                            ->orWhere('email', 'like', $like));
                });
            })
            ->when(in_array($s, ['pending','accepted','rejected']), fn($qb) => $qb->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Employee/Material/Index', [
            'items' => $items,
            'q'     => $q,
            's'     => $s,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $req = MR::with(['contractor:id,name,email', 'site:id,name'])
            ->where('assigned_user_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('Employee/Material/Show', [
            'req'        => $req,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function accept(Request $request, int $id)
    {
        $user = $request->user();
        $data = $request->validate([
            'comment' => ['nullable','string','max:2000'],
        ]);

        $mr = MR::with('contractor')->where('assigned_user_id', $user->id)->findOrFail($id);

        $qrText = "ENGIN conforme — Contractant: ".($mr->contractor->name ?? '')
            ." — Date: ".now()->format('Y-m-d');

        $png  = QrCode::format('png')->size(800)->margin(1)->generate($qrText);
        $path = 'qrcodes/material/'.$mr->id.'-'.Str::uuid().'.png';
        Storage::disk('public')->put($path, $png);

        $mr->update([
            'status'               => 'accepted',
            'decided_at'           => now(),
            'decided_by_user_id'   => $user->id,
            'decision_comment'     => $data['comment'] ?? null,
            'qrcode_path'          => $path,
            'qrcode_text'          => $qrText,
        ]);

        return back()->with('swal', ['type'=>'success','text'=>'Demande acceptée et QR généré.']);
    }

    public function reject(Request $request, int $id)
    {
        $user = $request->user();
        $data = $request->validate([
            'comment' => ['required','string','max:2000'],
        ]);

        $mr = MR::where('assigned_user_id', $user->id)->findOrFail($id);
        $mr->update([
            'status'               => 'rejected',
            'decided_at'           => now(),
            'decided_by_user_id'   => $user->id,
            'decision_comment'     => $data['comment'],
        ]);

        return back()->with('swal', ['type'=>'success','text'=>'Demande refusée.']);
    }

   // app/Http/Controllers/Employee/MaterialRequestInboxController.php

public function download(Request $request, int $id, string $field)
{
    $user = $request->user();

    // ✅ must match your columns (see phpMyAdmin screenshot)
    $allowed = [
        'controle_reglementaire',
        'assurance',
        'habilitation_conducteur',
        'rapports_conformite',
    ];
    abort_unless(in_array($field, $allowed, true), 404);

    $mr = MR::where('assigned_user_id', $user->id)->findOrFail($id);

    $column = $field . '_path';
    $path   = $mr->{$column} ?? null;
    abort_unless($path, 404);

    return Storage::disk('public')->download($path);
}

}

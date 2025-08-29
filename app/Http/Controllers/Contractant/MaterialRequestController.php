<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\MaterialRequest;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MaterialRequestController extends Controller
{
    public function index(Request $request)
    {
        $c = auth('contractor')->user();

        $cols = [
            'id','site_id',
            'controle_reglementaire_path','assurance_path','habilitation_conducteur_path','rapports_conformite_path',
            'status','qrcode_path','qrcode_text','created_at'
        ];

        $pending = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get($cols);

        $accepted = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'accepted')
            ->orderByDesc('created_at')
            ->get($cols);

        $rejected = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'rejected')
            ->orderByDesc('created_at')
            ->get($cols);

        $sites = Site::orderBy('name')->get(['id','name']);

        return Inertia::render('Contractant/Material/Index', [
            'pending'  => $pending,
            'accepted' => $accepted,
            'rejected' => $rejected,
            'counts'   => [
                'pending'  => $pending->count(),
                'accepted' => $accepted->count(),
                'rejected' => $rejected->count(),
            ],
            'sites'      => $sites,
            'csrf_token' => csrf_token(),
            'swal'       => session('swal'),
        ]);
    }

    public function store(Request $request)
    {
        $contractor = auth('contractor')->user();

        $data = $request->validate([
            'site_id'                 => ['required','exists:sites,id'],
            'controle_reglementaire'  => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
            'assurance'               => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
            'habilitation_conducteur' => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
            'rapports_conformite'     => ['required','file','mimes:pdf,doc,docx,png,jpg,jpeg','max:10240'],
        ]);

        // Save files
        $cr  = $request->file('controle_reglementaire')->store('materials/controle',   'public');
        $as  = $request->file('assurance')->store('materials/assurance',               'public');
        $hab = $request->file('habilitation_conducteur')->store('materials/habilitation', 'public');
        $rep = $request->file('rapports_conformite')->store('materials/rapports',      'public');

        // site responsible (nullable)
        $site = Site::find($data['site_id']);
        $assignedUserId = $site?->responsible_user_id;

        MaterialRequest::create([
            'contractor_id'               => $contractor->id,
            'site_id'                     => $data['site_id'],
            'assigned_user_id'            => $assignedUserId,
            'controle_reglementaire_path' => $cr,
            'assurance_path'              => $as,
            'habilitation_conducteur_path'=> $hab,
            'rapports_conformite_path'    => $rep,
            'status'                      => 'pending',
        ]);

        return back()->with('swal', [
            'type' => 'success',
            'text' => "Demande envoyée à l'administration.",
        ]);
    }

    // Optional detail page if you want it
    public function show(Request $request, int $id)
    {
        $contractor = auth('contractor')->user();

        $mr = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $contractor->id)
            ->findOrFail($id);

        return Inertia::render('Contractant/Material/Show', [
            'req'        => $mr,
            'csrf_token' => csrf_token(),
        ]);
    }
}

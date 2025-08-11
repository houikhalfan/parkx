<?php

namespace App\Http\Controllers;

use App\Models\Vod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class VodsController extends Controller
{
    public function show()
    {
        // Page avec onglets (Remplir / Historique / Notifications)
        return Inertia::render('Vods/VodsPage');
    }

 public function notifications()
{
    $u = auth()->user();
    $quota = (int)($u->vods_quota ?? 0);
    $start = now()->startOfMonth()->toDateString();
    $end   = now()->endOfMonth()->toDateString();
    $submitted = Vod::where('user_id', $u->id)
        ->whereBetween('date', [$start, $end])
        ->count();

    $remaining = max($quota - $submitted, 0);
    $daysLeft  = now()->endOfMonth()->diffInDays(now());

    return Inertia::render('Vods/VodsNotifications', [
        'vodsToComplete' => $remaining,
        'deadline'       => now()->endOfMonth()->format('d/m/Y'),
        'submitted'      => $submitted,
        'quota'          => $quota,
        'daysLeft'       => $daysLeft,
    ]);
}


    public function history()
    {
        $user = auth()->user();

        return Inertia::render('Vods/VodsHistory', [
            'vods' => $user->vods()->latest()->get(),
        ]);
    }
public function store(Request $request)
{
    $user  = $request->user();
    $quota = (int) ($user->vods_quota ?? 0);

    if ($quota > 0) {
        // ✅ filtre sur created_at (date d’émission)
        $start = now()->startOfMonth()->startOfDay();
        $end   = now()->endOfMonth()->endOfDay();

        $submitted = Vod::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        if ($submitted >= $quota) {
            $next = now()->startOfMonth()->addMonth()->format('d/m/Y');
            return back()->with('error', "Quota mensuel atteint. Le formulaire est bloqué jusqu’au {$next}.");
        }
    }

        $data = $request->validate([
            'date'                  => ['required', 'date'],
            'projet'                => ['required', 'string'],
            'activite'              => ['required', 'string'],
            'observateur'           => ['nullable', 'string'],
            'personnesObservees'    => ['required', 'array'],
            'personnesObservees.*'  => ['nullable', 'string'],
            'entrepriseObservee'    => ['required', 'array'],
            'entrepriseObservee.*'  => ['nullable', 'string'],

            'pratiques'                 => ['array'],
            'pratiques.*.text'          => ['nullable', 'string'],
            'pratiques.*.photo'         => ['nullable', 'image', 'max:4096'],

            'comportements'             => ['array'],
            'comportements.*.type'      => ['nullable', 'string'],
            'comportements.*.description'=> ['nullable', 'string'],
            'comportements.*.photo'     => ['nullable', 'image', 'max:4096'],

            'conditions' => ['array'],

            'correctives'               => ['array'],
            'correctives.*.action'      => ['nullable', 'string'],
            'correctives.*.responsable' => ['nullable', 'string'],
            'correctives.*.statut'      => ['nullable', 'string'],
            'correctives.*.photo'       => ['nullable', 'image', 'max:4096'],
        ]);

        // Bonnes pratiques
        $pratiques = [];
        foreach ($request->input('pratiques', []) as $i => $p) {
            $path = $request->hasFile("pratiques.$i.photo")
                ? $request->file("pratiques.$i.photo")->store("vods/pratiques", "public")
                : null;

            $pratiques[] = [
                'text'  => $p['text'] ?? '',
                'photo' => $path,
            ];
        }

        // Comportements dangereux
        $comportements = [];
        foreach ($request->input('comportements', []) as $i => $c) {
            $path = $request->hasFile("comportements.$i.photo")
                ? $request->file("comportements.$i.photo")->store("vods/comportements", "public")
                : null;

            $comportements[] = [
                'type'        => $c['type'] ?? '',
                'description' => $c['description'] ?? '',
                'photo'       => $path,
            ];
        }

        // Actions correctives (avec photo)
        $correctives = [];
        foreach ($request->input('correctives', []) as $key => $c) {
            $path = $request->hasFile("correctives.$key.photo")
                ? $request->file("correctives.$key.photo")->store("vods/correctives", "public")
                : null;

            $correctives[$key] = [
                'action'      => $c['action'] ?? '',
                'responsable' => $c['responsable'] ?? '',
                'statut'      => $c['statut'] ?? '',
                'photo'       => $path,
            ];
        }

        Vod::create([
            'user_id'             => auth()->id(),
            'date'                => $data['date'],
            'projet'              => $data['projet'],
            'activite'            => $data['activite'],
            'observateur'         => $data['observateur'] ?? auth()->user()->name,
            'personnes_observees' => $data['personnesObservees'],
            'entreprise_observee' => $data['entrepriseObservee'],
            'pratiques'           => $pratiques,
            'comportements'       => $comportements,
            'conditions'          => $data['conditions'] ?? [],
            'correctives'         => $correctives,
        ]);

      
return back()->with('success', 'Formulaire bien rempli.');
    }

    public function pdf(Vod $vod, Request $request)
    {
        if ($vod->user_id !== auth()->id()) {
            abort(403);
        }

        $pdf = Pdf::loadView('vods.pdf', ['vod' => $vod])->setPaper('a4');

        return $request->boolean('download')
            ? $pdf->download("VOD-{$vod->id}.pdf")
            : $pdf->stream("VOD-{$vod->id}.pdf");
    }

    // Data endpoints pour tes onglets SPA
    public function historyData()
    {
        $user = auth()->user();

        return response()->json([
            'vods' => $user->vods()->latest()->get(),
        ]);
    }

    public function notificationsData()
    {
        $user = auth()->user();

        return response()->json([
            'vodsToComplete' => $user->vods_to_complete ?? 0,
            'deadline'       => now()->endOfMonth()->format('d/m/Y'),
        ]);
    }
}

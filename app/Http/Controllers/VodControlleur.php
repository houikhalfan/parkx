<?php

namespace App\Http\Controllers;

use App\Models\Vod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VodController extends Controller
{
    public function create() {
        return Inertia::render('Vods/VodsForm');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'date' => 'required',
            'projet' => 'required',
            'activite' => 'required',
            'observateur' => 'required',
            'personnesObservees' => 'nullable',
            'entrepriseObservee' => 'nullable',
            'data' => 'required|json',
        ]);

        Vod::create([
            'user_id' => auth()->id(),
            ...$validated,
        ]);

        return redirect()->route('vods.history')->with('success', 'VODS enregistré.');
    }

    public function show(Vod $vod) {
        $this->authorize('view', $vod); // Optionnel
        return Inertia::render('Vods/VodDetails', ['vod' => $vod]);
    }
}

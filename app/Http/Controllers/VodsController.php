<?php
namespace App\Http\Controllers;

use Inertia\Inertia;

class VodsController extends Controller
{
   public function show()
{
    return Inertia::render('Vods/VodsPage');
}

    public function notifications()
{
    $user = auth()->user();

    return Inertia::render('Vods/VodsNotifications', [
        'vodsToComplete' => $user->vods_to_complete,
        'deadline' => now()->endOfMonth()->format('d/m/Y'),
    ]);
}

public function history()
{
    $user = auth()->user();

    return Inertia::render('Vods/VodsHistory', [
        'vods' => $user->vods()->latest()->get(),
    ]);
}


}

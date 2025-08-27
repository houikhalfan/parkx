<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ContractantController extends Controller
{
    public function home() {
        return Inertia::render('Contractant/Home');
    }

    public function documents() {
        return Inertia::render('Contractant/Documents/Index');
    }

    public function stats() {
        return Inertia::render('Contractant/Stats/Index');
    }

    public function depot() {
        // service name ideas: "Parapheur", "Dépôt & Signature", "SignLab", "e-Parapheur"
        return Inertia::render('Contractant/Depot/Index', [
            'serviceLabel' => 'Parapheur (Signature)',
        ]);
    }
}

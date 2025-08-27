<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ContractorAuthController extends Controller
{
    // Optional: if you want a dedicated contractor login page
    public function showLogin() {
        return Inertia::render('Welcome'); // you already show both tabs there
    }

    // POST /contractant/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('contractor')->attempt($request->only('email','password'))) {
            $request->session()->regenerate();

            // Require approval if you want
            if (!Auth::guard('contractor')->user()->is_approved) {
                Auth::guard('contractor')->logout();
                return back()->withErrors(['email' => 'Votre compte doit être approuvé par l’administration.']);
            }

            return redirect()->intended(route('contractant.home'));
        }

        return back()->withErrors(['email' => 'Identifiants invalides.']);
    }

    // POST /contractant/logout
    public function logout(Request $request)
    {
        Auth::guard('contractor')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('contractant.login');
    }

    // If you keep your public contractor registration endpoint:
    // POST /contractor/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:contractors,email',
            'password'       => 'required|string|min:6|confirmed',
            'phone'          => 'nullable|string|max:50',
            'company_name'   => 'nullable|string|max:255',
            'role'           => 'nullable|string|max:50',
        ]);

        $contractor = Contractor::create([
            'name'         => $data['name'],
            'email'        => $data['email'],
            'password'     => Hash::make($data['password']),
            'phone'        => $data['phone'] ?? null,
            'company_name' => $data['company_name'] ?? null,
            'role'         => $data['role'] ?? null,
            'is_approved'  => false, // pending by default
        ]);

        return back()->with('message', 'Demande envoyée. Vous serez notifié après approbation.');
    }
}

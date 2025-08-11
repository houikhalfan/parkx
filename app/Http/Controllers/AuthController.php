<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Contractor;
use App\Models\Vod; // ✅ pour compter les VODs du mois courant (created_at)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $type = $request->input('type');
        \Log::debug('🔍 Login request received', ['type' => $type, 'email' => $request->email]);

        if (!in_array($type, ['contractor', 'parkx'])) {
            \Log::warning('⚠️ Invalid login type', ['type' => $type]);
            throw ValidationException::withMessages([
                'type' => 'Invalid user type specified.',
            ]);
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'name' => $type === 'contractor' ? ['required', 'string'] : [],
        ]);

        if ($type === 'contractor') {
            \Log::info('🔐 Contractor login attempt', ['email' => $request->email]);

            $contractor = Contractor::where('email', $request->email)->first();

            if (!$contractor || !Hash::check($request->password, $contractor->password)) {
                \Log::warning('❌ Invalid contractor credentials.', ['email' => $request->email]);
                throw ValidationException::withMessages([
                    'email' => 'Invalid contractor credentials.',
                ]);
            }

            if (!$contractor->is_approved) {
                \Log::warning('⚠️ Contractor account not approved.', ['contractor_id' => $contractor->id]);
                throw ValidationException::withMessages([
                    'email' => 'Your account is pending admin approval.',
                ]);
            }

            session(['contractor_id' => $contractor->id]);
            \Log::info('✅ Contractor logged in successfully.', ['contractor_id' => $contractor->id]);

            return redirect()->route('dashboard');
        }

        // ParkX user login
        if (!Auth::attempt($request->only('email', 'password'))) {
            \Log::warning('❌ Invalid ParkX credentials.', ['email' => $request->email]);
            throw ValidationException::withMessages([
                'email' => 'Invalid ParkX credentials.',
            ]);
        }

        // ✅ Flash quota basé sur la date d’émission (created_at)
        $user  = Auth::user();
        $quota = (int)($user->vods_quota ?? 0);

        $start = now()->startOfMonth()->startOfDay();
        $end   = now()->endOfMonth()->endOfDay();

        $submitted = Vod::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $remaining = max($quota - $submitted, 0);
        $daysLeft  = max((int) now()->startOfDay()->diffInDays($end, false), 0);

        if ($quota > 0) {
            if ($remaining > 0) {
                $request->session()->flash(
                    'success',
                    "Il vous reste {$remaining} VOD(s) à soumettre ce mois-ci. Jours restants : {$daysLeft}."
                );
            } else {
                $next = now()->startOfMonth()->addMonth()->format('d/m/Y');
                $request->session()->flash(
                    'success',
                    "Quota mensuel atteint. Le formulaire VODS est bloqué jusqu’au {$next}."
                );
            }
        }

        $request->session()->regenerate();
        \Log::info('✅ ParkX user logged in.', ['user_id' => Auth::id()]);

        if (Auth::check()) {
    Auth::user()->forceFill(['last_login_at' => now()])->save();
}

return redirect()->intended('/dashboard');
    }

    public function contractorRegister(Request $request)
    {
        \Log::info('🛠️ Incoming request to contractorRegister', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:contractors,email',
            'password' => 'required|string|confirmed|min:8',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:100',
        ]);

        $contractor = Contractor::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'],
            'company_name' => $validated['company_name'],
            'role' => $validated['role'],
            'is_approved' => false,
        ]);

        \Log::info('✅ Contractor registered', ['contractor_id' => $contractor->id]);

        return back()->with('message', 'Registration submitted. Admin approval is required.');
    }
}

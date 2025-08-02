<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Contractor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $type = $request->input('type');

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
                \Log::warning('⚠️ Contractor account not approved yet.', ['contractor_id' => $contractor->id]);
                throw ValidationException::withMessages([
                    'email' => 'Your account is pending admin approval.',
                ]);
            }

            session(['contractor_id' => $contractor->id]);

            \Log::info('✅ Contractor logged in successfully.', ['contractor_id' => $contractor->id]);

            return redirect()->route('dashboard'); // Or route('contractor.dashboard') if using separate view
        }

        // ParkX user login
        if (!Auth::attempt($request->only('email', 'password'))) {
            \Log::warning('❌ Invalid ParkX credentials.', ['email' => $request->email]);
            throw ValidationException::withMessages([
                'email' => 'Invalid ParkX credentials.',
            ]);
        }

        $request->session()->regenerate();

        \Log::info('✅ ParkX user logged in.', ['user_id' => Auth::id()]);

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

        \Log::info('✅ Contractor registration validation passed');

        $contractor = Contractor::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'],
            'company_name' => $validated['company_name'],
            'role' => $validated['role'],
            'is_approved' => false,
        ]);

        \Log::info('✅ Contractor created:', $contractor->toArray());

        return back()->with('message', 'Registration submitted. Admin approval is required.');
    }
}

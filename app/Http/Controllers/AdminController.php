<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Admin login
    public function login(Request $request) 
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid admin credentials.',
            ]);
        }

        session(['admin_id' => $admin->id]);

        return Inertia::location(route('admin.dashboard'));
    }

    // Admin dashboard
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'pendingContractors' => Contractor::where('is_approved', false)->get(),
            'approvedContractors' => Contractor::where('is_approved', true)->get(),
            'csrf_token' => csrf_token(),
        ]);
    }

    // Create ParkX employee
    public function createParkxUser(Request $request)
    {
        \Log::info('👤 Creating Parkx user', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        \Log::info('✅ User created:', $user->toArray());

        return back()->with('success', 'User created successfully.');
    }

    // Approve contractor
    public function approveContractor($id)
    {
        $contractor = Contractor::findOrFail($id);
        $contractor->is_approved = true;
        $contractor->save();

        return back()->with('success', 'Contractor approved.');
    }

    // Reject contractor
    public function rejectContractor($id)
    {
        $contractor = Contractor::findOrFail($id);
        $contractor->delete();

        return back()->with('success', 'Contractor rejected and deleted.');
    }

    // ✅ Delete an approved contractor
    public function deleteApprovedContractor($id)
    {
        $contractor = Contractor::where('is_approved', true)->findOrFail($id);
        $contractor->delete();

        return back()->with('success', 'Contractor account deleted.');
    }
}

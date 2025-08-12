<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\User;
use App\Models\Vod;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    // Admin login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid admin credentials.',
            ]);
        }

        session(['admin_id' => $admin->id]);

        return Inertia::location(route('admin.home'));
    }

    // Admin dashboard (ParkX/Contractors management)
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'pendingContractors'  => Contractor::where('is_approved', false)->get(),
            'approvedContractors' => Contractor::where('is_approved', true)->get(),
            'users'               => User::select('id','name','email','vods_quota','created_at')->get(),
            'csrf_token'          => csrf_token(),
        ]);
    }

    // Create ParkX employee
    public function createParkxUser(Request $request)
    {
        \Log::info('👤 Creating Parkx user', $request->all());

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'password'    => bcrypt($validated['password']),
            'vods_quota'  => 0,
        ]);

        \Log::info('✅ User created:', $user->toArray());

        return back()->with('success', 'User created successfully.');
    }

    // Update ParkX user's VOD quota
    public function updateUserVodsQuota($id, Request $request)
    {
        $data = $request->validate([
            'vods_quota' => ['required','integer','min:0'],
        ]);

        $user = User::findOrFail($id);
        $user->update(['vods_quota' => $data['vods_quota']]);

        return back()->with('success', 'Quota updated.');
    }

    // Delete ParkX user
    public function deleteParkxUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'User deleted.');
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

    // Delete approved contractor
    public function deleteApprovedContractor($id)
    {
        $contractor = Contractor::where('is_approved', true)->findOrFail($id);
        $contractor->delete();

        return back()->with('success', 'Contractor account deleted.');
    }

    // Admin Home (French month + completed this month = inserted this month)
    public function home()
    {
        // KPI counts
        $totalUsers       = User::count();
        $totalContractors = Contractor::count();

        // VODs "terminés" = rows inserted this month (created_at in current month)
        $vodsCompleted = Vod::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        // VODs "à rendre" = sum of users' monthly quotas
        $vodsDue = (int) User::sum('vods_quota');

        // Recent logins
        $recentLogins = User::whereNotNull('last_login_at')
            ->orderByDesc('last_login_at')
            ->limit(8)
            ->get(['id','name','email','last_login_at']);

        // Pending contractors (list + count for sidebar badge)
        $pendingApprovals = Contractor::where('is_approved', false)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id','name','email','company_name','created_at']);

        $pendingCount = Contractor::where('is_approved', false)->count();

        // French month label (e.g., "août 2025")
        $monthLabel = Carbon::now()->locale('fr')->isoFormat('MMMM YYYY');

        return Inertia::render('Admin/Home', [
            'stats' => [
                'users'        => $totalUsers,
                'contractors'  => $totalContractors,
                'vods_due'     => $vodsDue,
                'vods_done'    => $vodsCompleted,
                'month_label'  => $monthLabel,
            ],
            'recentLogins'     => $recentLogins,
            'pendingApprovals' => $pendingApprovals,
            'pendingCount'     => $pendingCount,
            'csrf_token'       => csrf_token(),
        ]);
    }
}

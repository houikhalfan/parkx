<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Vod;

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

        return Inertia::location(route('admin.home'));
    }

    // Admin dashboard
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'vods_quota' => 0, // default
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
public function home()
{
    $monthStart = now()->startOfMonth();
    $monthEnd   = now()->endOfMonth();

    // Basic counts
    $totalUsers        = User::count();
    $totalContractors  = Contractor::count();

    // VOD progress this month
    $vodsCompleted = Vod::whereBetween('date', [$monthStart, $monthEnd])->count();

    // If "due" is the sum of per-user monthly quotas
    $vodsDue = User::sum('vods_quota');

    // Recent logins (ParkX users)
    $recentLogins = User::whereNotNull('last_login_at')
        ->orderByDesc('last_login_at')
        ->limit(8)
        ->get(['id', 'name', 'email', 'last_login_at']);

    // Pending approvals (top 3)
   $pendingCount = Contractor::where('is_approved', false)->count();

return Inertia::render('Admin/Home', [
    'stats' => [
        'users'        => $totalUsers,
        'contractors'  => $totalContractors,
        'vods_due'     => (int) $vodsDue,
        'vods_done'    => (int) $vodsCompleted,
        'month_label'  => now()->format('F Y'),
    ],
    'recentLogins'     => $recentLogins,
    'pendingApprovals' => $pending,     // list (top few)
    'pendingCount'     => $pendingCount, // 🔔 for sidebar badge
    'csrf_token'       => csrf_token(),
]);
}
}

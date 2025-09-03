<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\User;
use App\Models\Vod;
use App\Models\Site; // ⬅️ add this import
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

    public function dashboard()
    {
        // Sites list for the <select> and for id->name mapping on the table
        $sites = Site::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Dashboard', [
            // ⬇️ include site_id so the UI can display the site name
            'users' => User::orderBy('created_at', 'desc')
                ->get(['id', 'name', 'email', 'vods_quota', 'created_at', 'site_id']),

            'pendingContractors'  => Contractor::where('is_approved', false)
                ->orderBy('created_at', 'desc')
                ->get(),

            'approvedContractors' => Contractor::where('is_approved', true)
                ->orderBy('created_at', 'desc')
                ->get(),

            'sites'      => $sites,
            'csrf_token' => csrf_token(),
            'url'        => request()->getRequestUri(),
        ]);
    }

    // Create ParkX employee
    public function createParkxUser(Request $request)
    {
        $data = $request->validate([
            'name'                  => ['required','string','max:255'],
            'email'                 => ['required','email','max:255','unique:users,email'],
            'password'              => ['required','string','min:8','confirmed'],
            'site_id'               => ['nullable','exists:sites,id'], // ✅ new
        ]);

        User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
            'site_id'  => $data['site_id'] ?? null, // ✅ bind to site
        ]);

        return back()->with('success', 'Utilisateur créé.');
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

    // Admin Home
    public function home()
    {
        // KPI counts
        $totalUsers       = User::count();
        $totalContractors = Contractor::count();

        // VODs "terminés" = rows inserted this month
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

        // Pending contractors
        $pendingApprovals = Contractor::where('is_approved', false)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id','name','email','company_name','created_at']);

        $pendingCount = Contractor::where('is_approved', false)->count();

        // French month label
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

    // Get notifications for admin
    public function notifications()
    {
        $adminId = session('admin_id');
        if (!$adminId) {
            return response()->json(['notifications' => []]);
        }

        $admin = Admin::find($adminId);
        if (!$admin) {
            return response()->json(['notifications' => []]);
        }

        $notifications = $admin->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    // Mark notification as read
    public function markNotificationRead($id)
    {
        $adminId = session('admin_id');
        if (!$adminId) {
            return response()->json(['success' => false], 401);
        }

        $admin = Admin::find($adminId);
        if (!$admin) {
            return response()->json(['success' => false], 401);
        }

        $notification = $admin->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true]);
    }

    // Mark all notifications as read
    public function markAllNotificationsRead()
    {
        $adminId = session('admin_id');
        if (!$adminId) {
            return response()->json(['success' => false], 401);
        }

        $admin = Admin::find($adminId);
        if (!$admin) {
            return response()->json(['success' => false], 401);
        }

        $admin->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }

    // Show pending contractors for approval
    public function pendingContractors()
    {
        $pendingContractors = Contractor::where('is_approved', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/PendingContractors', [
            'pendingContractors' => $pendingContractors,
            'csrf_token' => csrf_token(),
        ]);
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\Vod;
use App\Models\SignatureRequest; // ✅ for assigned papers count
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Expose both guards to the frontend
            'auth' => [
                'user'       => Auth::guard('web')->user(),         // ParkX user
                'contractor' => Auth::guard('contractor')->user(),  // Contractor user
            ],

            // Common flash messages
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],

            // Quota only for ParkX users (kept as-is)
            'quota' => function () {
                $u = Auth::guard('web')->user(); // only ParkX users have quotas
                if (!$u) {
                    return null; // contractors get no quota block in UI
                }

                $quota = (int) ($u->vods_quota ?? 0);
                $start = now()->startOfMonth()->startOfDay();
                $end   = now()->endOfMonth()->endOfDay();

                $submitted = Vod::where('user_id', $u->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                $daysLeft = max((int) now()->startOfDay()->diffInDays($end, false), 0);

                return [
                    'quota'     => $quota,
                    'submitted' => $submitted,
                    'remaining' => $quota === 0 ? 0 : max($quota - $submitted, 0), // 0 = illimité côté UI
                    'daysLeft'  => $daysLeft,
                    'canSubmit' => $quota === 0 ? true : ($submitted < $quota),
                    'period'    => [
                        'start' => $start->toDateString(),
                        'end'   => $end->toDateString(),
                    ],
                ];
            },

            // ✅ New: counts used by the header/notifications in DashboardLayout
            'counts' => function () {
                $u = Auth::guard('web')->user();
                if (!$u) {
                    return [];
                }

                // Papers assigned to this ParkX employee and still pending
                $assigned = SignatureRequest::where('assigned_user_id', $u->id)
                    ->where('status', 'assigned')
                    ->count();

                // VODs remaining this month (same logic as in quota)
                $quota = (int) ($u->vods_quota ?? 0);
                $start = now()->startOfMonth()->startOfDay();
                $end   = now()->endOfMonth()->endOfDay();

                $submitted = Vod::where('user_id', $u->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                $remaining = $quota === 0 ? 0 : max($quota - $submitted, 0); // 0 = illimité, donc pas d’alerte

                // If you have a real notifications system, replace 0 by unread count
                return [
                    'assigned_papers' => $assigned,
                    'vods_remaining'  => $remaining,
                    'notifications'   => 0,
                ];
            },
        ]);
    }
}

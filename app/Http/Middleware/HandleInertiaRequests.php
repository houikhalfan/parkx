<?php

namespace App\Http\Middleware;

use App\Models\Vod;                    // ✅ import the Eloquent model
use Illuminate\Http\Request;
use Inertia\Middleware;



class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // ...auth/flash...

            'quota' => function () use ($request) {
                $u = $request->user();
                if (!$u) return null;

                $quota = (int) ($u->vods_quota ?? 0);

                $start = now()->startOfMonth()->startOfDay();
                $end   = now()->endOfMonth()->endOfDay();

                $submitted = Vod::where('user_id', $u->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                $daysLeft = max((int) now()->startOfDay()->diffInDays($end, false), 0);

                return [
                    'quota'      => $quota,
                    'submitted'  => $submitted,
                    'remaining'  => max($quota - $submitted, 0),
                    'daysLeft'   => $daysLeft,
                    'canSubmit'  => $quota === 0 ? true : ($submitted < $quota),
                    'period'     => ['start' => $start->toDateString(), 'end' => $end->toDateString()],
                ];
            },
        ]);
    }
}

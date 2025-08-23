<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Inertia::share([
            'auth' => fn () => [
                'user' => Auth::user(),
            ],
            'contractorId' => fn () => session('contractor_id'),
            'flash' => fn () => [
                'success' => session('success'),
                'error'   => session('error'),
                'message' => session('message'),
            ],
        ]);
    }
}

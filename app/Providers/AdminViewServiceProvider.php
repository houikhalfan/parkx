<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\Contractor;

class AdminViewServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Share pending contractor count with all admin views
        View::composer('*', function ($view) {
            // Only add data if we're in an admin context
            if (request()->is('admin*') && session()->has('admin_id')) {
                $pendingCount = Contractor::where('is_approved', false)->count();
                $view->with('pendingCount', $pendingCount);
            }
        });
    }
}

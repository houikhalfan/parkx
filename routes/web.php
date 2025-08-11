<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Controllers\VodController;

// Middleware
use App\Http\Middleware\AdminAuth;
Route::prefix('admin')->group(function () {
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('admin.login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        // NEW Home page
        Route::get('/home', [AdminController::class, 'home'])->name('admin.home');

        // Existing dashboard (users/contractors management)
        Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');

        // Manage ParkX Users
        Route::post('/users', [AdminController::class, 'createParkxUser']);
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota']);
        Route::post('/users/{id}/delete', [AdminController::class, 'deleteParkxUser']);

        // Manage Contractors
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor']);
        Route::post('/contractors/{id}/reject', [AdminController::class, 'rejectContractor']);
        Route::post('/contractors/{id}/delete', [AdminController::class, 'deleteApprovedContractor']);

        // Logout
        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('admin.logout');
    });
});
// Home & Auth Routes
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister']);

// Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
Route::get('/vods/history/data', [VodsController::class, 'historyData'])
    ->name('vods.history.data');
Route::get('/vods/notifications/data', [VodsController::class, 'notificationsData'])
    ->name('vods.notifications.data');


    // VODS Access & Forms
Route::middleware('auth')->group(function () {
    Route::get('/vods', [VodsController::class, 'show'])->name('vods.show');
    Route::get('/vods/form', [VodsController::class, 'show'])->name('vods.form'); // same page as show
    Route::post('/vods/store', [VodsController::class, 'store'])->name('vods.store');
    Route::get('/vods/history', [VodsController::class, 'history'])->name('vods.history');
    Route::get('/vods/notification', [VodsController::class, 'notification'])->name('vods.notification');
    Route::get('/vods/{vod}/pdf', [VodsController::class, 'pdf'])->name('vods.pdf'); // ✅

});
    // Logout
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

// Admin Auth Routes
Route::prefix('admin')->group(function () {
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('admin.login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');

        // Manage ParkX Users
        Route::post('/users', [AdminController::class, 'createParkxUser']);
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota']);
        Route::post('/users/{id}/delete', [AdminController::class, 'deleteParkxUser']);

        // Manage Contractors
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor']);
        Route::post('/contractors/{id}/reject', [AdminController::class, 'rejectContractor']);
        Route::post('/contractors/{id}/delete', [AdminController::class, 'deleteApprovedContractor']);

        // Admin Logout
        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('admin.logout');
    });
});

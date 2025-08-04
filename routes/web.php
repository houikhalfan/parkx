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

// Home & Auth Routes
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister']);

// Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // VODS Access & Forms
Route::middleware('auth')->group(function () {
    Route::get('/vods', [\App\Http\Controllers\VodsController::class, 'show'])->name('vods.show');
});
    Route::get('/vods/form', [VodController::class, 'create'])->name('vods.create');
    Route::post('/vods/store', [VodController::class, 'store'])->name('vods.store');
    Route::get('/vods/history', [VodController::class, 'history'])->name('vods.history');
    Route::get('/vods/notifications', [VodController::class, 'notifications'])->name('vods.notifications');
    Route::get('/vods/{vod}', [VodController::class, 'show'])->name('vods.show');

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

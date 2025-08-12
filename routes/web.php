<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Middleware\AdminAuth;

/**
 * PUBLIC + USER ROUTES
 */
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister']);

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // VODS
    Route::get('/vods', [VodsController::class, 'show'])->name('vods.show');
    Route::get('/vods/form', [VodsController::class, 'show'])->name('vods.form');
    Route::post('/vods/store', [VodsController::class, 'store'])->name('vods.store');
    Route::get('/vods/history', [VodsController::class, 'history'])->name('vods.history');
    Route::get('/vods/history/data', [VodsController::class, 'historyData'])->name('vods.history.data');
    Route::get('/vods/notification', [VodsController::class, 'notification'])->name('vods.notification');
    Route::get('/vods/notifications/data', [VodsController::class, 'notificationsData'])->name('vods.notifications.data');
    Route::get('/vods/{vod}/pdf', [VodsController::class, 'pdf'])->name('vods.pdf');

    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

/**
 * ADMIN ROUTES — single group, only existing controllers
 */
Route::prefix('admin')->name('admin.')->group(function () {
    // Auth (no AdminAuth)
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        // Home page (your Admin/Home Inertia page)
        Route::get('/home', [AdminController::class, 'home'])->name('home');

        // Dashboard page that shows ParkX/Contractor tabs (your AdminDashboard component)
        // You can pass ?tab=contractors to open the contractors tab.
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        // Actions
        Route::post('/users', [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->name('users.update-quota');
        Route::post('/users/{id}/delete', [AdminController::class, 'deleteParkxUser'])->name('users.delete');

        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->name('contractors.approve');
        Route::post('/contractors/{id}/reject', [AdminController::class, 'rejectContractor'])->name('contractors.reject');
        Route::post('/contractors/{id}/delete', [AdminController::class, 'deleteApprovedContractor'])->name('contractors.delete');

        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('logout');
    });
});

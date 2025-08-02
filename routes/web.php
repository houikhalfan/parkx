<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\AdminAuth;

// 🌐 Public Pages
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister']);

// 🔐 Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

// 🛡️ Admin Login Routes
Route::get('/admin/login', fn () => Inertia::render('Admin/Login'))->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login.submit');

// ✅ Admin Routes (session protected)
Route::middleware([AdminAuth::class])->group(function () {
Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/admin/users', [AdminController::class, 'createParkxUser']);
    Route::post('/admin/contractors/{id}/approve', [AdminController::class, 'approveContractor']);
    Route::post('/admin/contractors/{id}/reject', [AdminController::class, 'rejectContractor']);
    Route::post('/admin/logout', function () {
        session()->forget('admin_id');
        return redirect()->route('admin.login');
    })->name('admin.logout');
});


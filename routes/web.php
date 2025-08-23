<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Controllers\ContractorStatsController;
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
 * CONTRACTOR STATS (your “Statistiques” app)
 * We use your contractor session key: session('contractor_id')
 */
Route::prefix('contractor/stats')->name('contractor.stats.')->group(function () {
    Route::get('/new',    [ContractorStatsController::class, 'create'])->name('create');
    Route::post('/',      [ContractorStatsController::class, 'store'])->name('store');
    Route::get('/history',[ContractorStatsController::class, 'history'])->name('history');
});

/**
 * ADMIN ROUTES
 */
Route::prefix('admin')->name('admin.')->group(function () {
    // Auth (no AdminAuth)
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/home', [AdminController::class, 'home'])->name('home');
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        Route::post('/users', [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->name('users.update-quota');
        Route::post('/users/{id}/delete', [AdminController::class, 'deleteParkxUser'])->name('users.delete');

        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->name('contractors.approve');
        Route::post('/contractors/{id}/reject', [AdminController::class, 'rejectContractor'])->name('contractors.reject');
        Route::post('/contractors/{id}/delete', [AdminController::class, 'deleteApprovedContractor'])->name('contractors.delete');

        // (your existing admin views for stats can keep using the same list/download logic)
        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('logout');
    });
});

<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Middleware\AdminAuth;
use App\Http\Controllers\ContractantController;
use App\Http\Controllers\Contractant\SignatureRequestController as ContractorSignCtrl;
use App\Http\Controllers\Admin\SignatureRequestController as AdminSignCtrl;
use App\Http\Controllers\InAppSignController; // ✅ in-app signing for ParkX employees (no email)

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

    // ✅ In-app signing inbox for ParkX employees
    Route::get('/signatures/inbox',               [InAppSignController::class, 'inbox'])->name('sign.inbox');
    Route::get('/signatures/inbox/{id}/sign',     [InAppSignController::class, 'signForm'])->name('sign.inbox.form');
    Route::post('/signatures/inbox/{id}/sign',    [InAppSignController::class, 'signSubmit'])->name('sign.inbox.submit');

    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

/**
 * ADMIN ROUTES
 */
Route::prefix('admin')->name('admin.')->group(function () {
    // Auth
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/home', [AdminController::class, 'home'])->name('home');
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        // ParkX users
        Route::post('/users', [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->name('users.update-quota');
        Route::post('/users/{id}/delete', [AdminController::class, 'deleteParkxUser'])->name('users.delete');

        // Contractors
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->name('contractors.approve');
        Route::post('/contractors/{id}/reject',  [AdminController::class, 'rejectContractor'])->name('contractors.reject');
        Route::post('/contractors/{id}/delete',  [AdminController::class, 'deleteApprovedContractor'])->name('contractors.delete');

        // Signature flows (admin side)
        Route::get('/signatures',                        [AdminSignCtrl::class, 'index'])->name('signatures.index');
        Route::get('/signatures/{id}',                   [AdminSignCtrl::class, 'show'])->name('signatures.show');
        Route::get('/signatures/{id}/download-original', [AdminSignCtrl::class, 'downloadOriginal'])->name('signatures.download.original');
        Route::post('/signatures/{id}/approve',          [AdminSignCtrl::class, 'approve'])->name('signatures.approve');
        Route::post('/signatures/{id}/reject',           [AdminSignCtrl::class, 'reject'])->name('signatures.reject');

        // ✅ Pure in-app flow: assign to employee OR sign by admin (upload signed PDF)
        Route::post('/signatures/{id}/assign',           [AdminSignCtrl::class, 'assign'])->name('signatures.assign');
        Route::get ('/signatures/{id}/sign',             [AdminSignCtrl::class, 'signForm'])->name('signatures.sign.form');
        Route::post('/signatures/{id}/sign',             [AdminSignCtrl::class, 'signSubmit'])->name('signatures.sign.submit');

        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('logout');
    });
});

/**
 * CONTRACTANT (Contractor) ROUTES
 */
Route::prefix('contractant')->name('contractant.')->group(function () {
    // Auth
    Route::get('/login', [\App\Http\Controllers\ContractorAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\ContractorAuthController::class, 'login'])->name('login.submit');

    Route::middleware('auth:contractor')->group(function () {
        Route::get('/', [ContractantController::class, 'home'])->name('home');
        Route::get('/documents', [ContractantController::class, 'documents'])->name('documents');
        Route::get('/statistiques', [ContractantController::class, 'stats'])->name('stats');
        Route::get('/depot-signatures', [ContractantController::class, 'depot'])->name('depot');

        // Parapheur (signature)
        Route::get('/parapheur',                        [ContractorSignCtrl::class, 'index'])->name('parapheur.index');
        Route::post('/parapheur',                       [ContractorSignCtrl::class, 'store'])->name('parapheur.store');
        Route::get('/parapheur/{id}',                   [ContractorSignCtrl::class, 'show'])->name('parapheur.show');
        Route::get('/parapheur/{id}/download-original', [ContractorSignCtrl::class, 'downloadOriginal'])->name('parapheur.download.original');
        Route::get('/parapheur/{id}/download-signed',   [ContractorSignCtrl::class, 'downloadSigned'])->name('parapheur.download.signed');
        Route::post('/parapheur/{id}/comment',          [ContractorSignCtrl::class, 'comment'])->name('parapheur.comment');

        Route::post('/logout', [\App\Http\Controllers\ContractorAuthController::class, 'logout'])->name('logout');
    });
});

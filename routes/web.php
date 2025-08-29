<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Middleware\AdminAuth;

// Auth + core
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Controllers\ContractantController;
use App\Http\Controllers\ContractorAuthController;
use App\Http\Controllers\ContractorStatsController;

// Signatures
use App\Http\Controllers\Contractant\SignatureRequestController as ContractorSignCtrl;
use App\Http\Controllers\Admin\SignatureRequestController as AdminSignCtrl;
use App\Http\Controllers\Employee\SignatureInboxController;

// Sites
use App\Http\Controllers\Admin\SiteController as AdminSiteController;

// Matériel
use App\Http\Controllers\Employee\MaterialRequestInboxController as EmpMaterialCtrl;
use App\Http\Controllers\Contractant\MaterialRequestController as ContractorMaterialCtrl;

/*
|--------------------------------------------------------------------------
| PUBLIC + USER ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister'])->name('contractor.register');

/*
|--------------------------------------------------------------------------
| LOGGED-IN ParkX USERS (web guard)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Employee – Matériel inbox (site responsables)
    Route::prefix('materiel')->name('employee.materiel.')->group(function () {
        Route::get('/',                       [EmpMaterialCtrl::class, 'index'])->name('index');
        Route::get('/{id}',                   [EmpMaterialCtrl::class, 'show'])->whereNumber('id')->name('show');
        Route::post('/{id}/accept',           [EmpMaterialCtrl::class, 'accept'])->whereNumber('id')->name('accept');
        Route::post('/{id}/reject',           [EmpMaterialCtrl::class, 'reject'])->whereNumber('id')->name('reject');
        Route::get ('/{id}/download/{field}', [EmpMaterialCtrl::class, 'download'])->whereNumber('id')->name('download');
    });

    // Dashboard
    Route::get('/dashboard', function () {
        $user = auth()->user();

        $isResponsible = \App\Models\Site::where('responsible_user_id', $user->id)->exists();
        $assignedPending = \App\Models\SignatureRequest::where('assigned_user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Dashboard', [
            'isResponsible'   => $isResponsible,
            'assignedPending' => $assignedPending,
        ]);
    })->name('dashboard');

    // Employee – Signatures inbox
    Route::prefix('signatures')->name('employee.signatures.')->group(function () {
        Route::get('/',                       [SignatureInboxController::class, 'index'])->name('index');
        Route::get('/{id}',                   [SignatureInboxController::class, 'show'])->whereNumber('id')->name('show');
        Route::get('/{id}/download-original', [SignatureInboxController::class, 'downloadOriginal'])->whereNumber('id')->name('download.original');
        Route::post('/{id}/approve',          [SignatureInboxController::class, 'approve'])->whereNumber('id')->name('approve');
        Route::post('/{id}/reject',           [SignatureInboxController::class, 'reject'])->whereNumber('id')->name('reject');
        Route::get('/{id}/sign',              [SignatureInboxController::class, 'signForm'])->whereNumber('id')->name('sign.form');
        Route::post('/{id}/sign',             [SignatureInboxController::class, 'signSubmit'])->whereNumber('id')->name('sign.submit');
    });

    // VODS
    Route::get('/vods',                    [VodsController::class, 'show'])->name('vods.show');
    Route::get('/vods/form',               [VodsController::class, 'show'])->name('vods.form');
    Route::post('/vods/store',             [VodsController::class, 'store'])->name('vods.store');
    Route::get('/vods/history',            [VodsController::class, 'history'])->name('vods.history');
    Route::get('/vods/history/data',       [VodsController::class, 'historyData'])->name('vods.history.data');
    Route::get('/vods/notification',       [VodsController::class, 'notification'])->name('vods.notification');
    Route::get('/vods/notifications/data', [VodsController::class, 'notificationsData'])->name('vods.notifications.data');
    Route::get('/vods/{vod}/pdf',          [VodsController::class, 'pdf'])->whereNumber('vod')->name('vods.pdf');

    // Logout (web guard)
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

// Public QR verification (for external scanners)
Route::get('/verify/material/{token}', [\App\Http\Controllers\QrVerifyController::class, 'material'])->name('qr.material');

/*
|--------------------------------------------------------------------------
| CONTRACTOR “STATISTIQUES” APP (custom session)
|--------------------------------------------------------------------------
*/
Route::prefix('contractor/stats')->name('contractor.stats.')->group(function () {
    Route::get('/new',     [ContractorStatsController::class, 'create'])->name('create');
    Route::post('/',       [ContractorStatsController::class, 'store'])->name('store');
    Route::get('/history', [ContractorStatsController::class, 'history'])->name('history');
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    // Auth pages
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/home', [AdminController::class, 'home'])->name('home');            // KPIs / cards
        Route::get('/',      [AdminController::class, 'dashboard'])->name('dashboard'); // Users/Contractors tabs

        // Sites
        Route::get ('/sites',               [AdminSiteController::class, 'index'])->name('sites.index');
        Route::post('/sites',               [AdminSiteController::class, 'store'])->name('sites.store');
        Route::post('/sites/{site}/update', [AdminSiteController::class, 'update'])->name('sites.update');
        Route::post('/sites/{site}/delete', [AdminSiteController::class, 'destroy'])->name('sites.delete');

        // ParkX users
        Route::post('/users',                   [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->whereNumber('id')->name('users.update-quota');
        Route::post('/users/{id}/delete',       [AdminController::class, 'deleteParkxUser'])->whereNumber('id')->name('users.delete');

        // Contractors
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->whereNumber('id')->name('contractors.approve');
        Route::post('/contractors/{id}/reject',  [AdminController::class, 'rejectContractor'])->whereNumber('id')->name('contractors.reject');
        Route::post('/contractors/{id}/delete',  [AdminController::class, 'deleteApprovedContractor'])->whereNumber('id')->name('contractors.delete');

        // Admin signatures
        Route::get ('/signatures',                        [AdminSignCtrl::class, 'index'])->name('signatures.index');
        Route::get ('/signatures/{id}',                   [AdminSignCtrl::class, 'show'])->whereNumber('id')->name('signatures.show');
        Route::get ('/signatures/{id}/download-original', [AdminSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('signatures.download.original');
        Route::post('/signatures/{id}/approve',           [AdminSignCtrl::class, 'approve'])->whereNumber('id')->name('signatures.approve');
        Route::post('/signatures/{id}/reject',            [AdminSignCtrl::class, 'reject'])->whereNumber('id')->name('signatures.reject');

        // Pure in-app flow
        Route::post('/signatures/{id}/assign', [AdminSignCtrl::class, 'assign'])->whereNumber('id')->name('signatures.assign');
        Route::get ('/signatures/{id}/sign',   [AdminSignCtrl::class, 'signForm'])->whereNumber('id')->name('signatures.sign.form');
        Route::post('/signatures/{id}/sign',   [AdminSignCtrl::class, 'signSubmit'])->whereNumber('id')->name('signatures.sign.submit');

        // Admin logout
        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('logout');
    });
});

/*
|--------------------------------------------------------------------------
| CONTRACTANT (Contractor portal) – guard: contractor
|--------------------------------------------------------------------------
*/
Route::prefix('contractant')->name('contractant.')->group(function () {
    // Contractor auth
    Route::get('/login',  [ContractorAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [ContractorAuthController::class, 'login'])->name('login.submit');

    Route::middleware('auth:contractor')->group(function () {
        Route::get('/',                 [ContractantController::class, 'home'])->name('home');
        Route::get('/documents',        [ContractantController::class, 'documents'])->name('documents');
        Route::get('/statistiques',     [ContractantController::class, 'stats'])->name('stats');
        Route::get('/depot-signatures', [ContractantController::class, 'depot'])->name('depot');

        // RESSOURCES MATÉRIEL (Contractant)
// web.php  (inside the contractant group)
Route::get ('/materiel',      \App\Http\Controllers\Contractant\MaterialRequestController::class.'@index')
    ->name('materiel.index');

Route::post('/materiel',      \App\Http\Controllers\Contractant\MaterialRequestController::class.'@store')
    ->name('materiel.store');   // <-- change this line (was materials.store)

Route::get ('/materiel/{id}', \App\Http\Controllers\Contractant\MaterialRequestController::class.'@show')
    ->whereNumber('id')
    ->name('materiel.show');

        // If you add a download() in the controller, enable this:
        // Route::get ('/materiel/{id}/download/{file}', [ContractorMaterialCtrl::class, 'download'])
        //     ->whereNumber('id')->name('materials.download');

        // Parapheur (contractor uploads + tracking)
        Route::get ('/parapheur',                        [ContractorSignCtrl::class, 'index'])->name('parapheur.index');
        Route::post('/parapheur',                        [ContractorSignCtrl::class, 'store'])->name('parapheur.store');
        Route::get ('/parapheur/{id}',                   [ContractorSignCtrl::class, 'show'])->whereNumber('id')->name('parapheur.show');
        Route::get ('/parapheur/{id}/download-original', [ContractorSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('parapheur.download.original');
        Route::get ('/parapheur/{id}/download-signed',   [ContractorSignCtrl::class, 'downloadSigned'])->whereNumber('id')->name('parapheur.download.signed');
        Route::post('/parapheur/{id}/comment',           [ContractorSignCtrl::class, 'comment'])->whereNumber('id')->name('parapheur.comment');

        // Contractor logout
        Route::post('/logout', [ContractorAuthController::class, 'logout'])->name('logout');
    });
});

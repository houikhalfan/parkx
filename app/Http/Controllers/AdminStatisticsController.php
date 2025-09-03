<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HseStat;
use App\Models\User;

class AdminStatisticsController extends Controller
{
    public function index()
    {
        $statistics = HseStat::with(['user', 'contractor'])
            ->where('user_type', 'contractor')  // Only show contractor statistics
            ->latest('date')
            ->latest('id')
            ->paginate(20);

        return Inertia::render('Admin/Statistics/Index', [
            'statistics' => $statistics
        ]);
    }

    public function show($id)
    {
        $statistics = HseStat::with(['user', 'contractor'])->findOrFail($id);
        
        return Inertia::render('Admin/Statistics/Show', [
            'statistics' => $statistics
        ]);
    }
}

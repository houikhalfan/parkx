<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SiteController extends Controller
{
    public function index()
    {
        // ParkX users to choose as responsible (optional)
        $users = DB::table('users')
            ->select('id','name','email')
            ->orderBy('name')
            ->get();

        // Sites list + responsible + employees count
        $sites = [];
        $rows  = DB::table('sites')
            ->select('id','name','responsible_user_id')
            ->orderBy('name')
            ->get();

        foreach ($rows as $r) {
            $manager = $r->responsible_user_id
                ? DB::table('users')->select('id','name','email')->find($r->responsible_user_id)
                : null;

            $employeesCount = DB::table('users')->where('site_id', $r->id)->count();

            $sites[] = [
                'id'               => $r->id,
                'name'             => $r->name,
                'manager'          => $manager,   // {id, name, email} | null
                'employees_count'  => $employeesCount,
            ];
        }

        return Inertia::render('Admin/Sites', [
            'users'  => $users,
            'sites'  => $sites,
            // Flash helpers for SweetAlert
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'csrf_token' => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        // Responsible is OPTIONAL
        $data = $request->validate([
            'name'                => ['required','string','max:255'],
            'responsible_user_id' => ['nullable','integer','exists:users,id'],
        ]);

        DB::table('sites')->insert([
            'name'                => $data['name'],
            'responsible_user_id' => $data['responsible_user_id'] ?? null,
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        return back()->with('success', 'Site créé avec succès.');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'name'                => ['required','string','max:255'],
            'responsible_user_id' => ['nullable','integer','exists:users,id'],
        ]);

        DB::table('sites')->where('id', $id)->update([
            'name'                => $data['name'],
            'responsible_user_id' => $data['responsible_user_id'] ?? null,
            'updated_at'          => now(),
        ]);

        return back()->with('success', 'Site mis à jour.');
    }

    public function destroy(int $id)
    {
        DB::table('sites')->where('id', $id)->delete();
        return back()->with('success', 'Site supprimé.');
    }
}

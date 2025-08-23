<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StatReport;

class StatReportAdminController extends Controller
{
    public function index()
    {
        $reports = StatReport::with('contractor:id,name,email')
            ->latest()
            ->select('id','contractor_id','trir','ltir','dart','total_hours','pdf_path','created_at')
            ->paginate(15);

        return inertia('Admin/Stats/Index', [
            'reports' => $reports,
        ]);
    }

    public function downloadPdf(StatReport $report)
    {
        abort_unless($report->pdf_path, 404);
        return response()->download(
            storage_path('app/'.$report->pdf_path),
            "statistiques_{$report->id}.pdf",
            ['Content-Type' => 'application/pdf']
        );
    }
}

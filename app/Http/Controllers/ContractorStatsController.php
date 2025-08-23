<?php

namespace App\Http\Controllers;

use App\Models\StatReport;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Dompdf\Dompdf;
use Dompdf\Options;

class ContractorStatsController extends Controller
{
    /** Show the stats form for the contractor. */
    public function create(): InertiaResponse|RedirectResponse
    {
        $contractorId = session('contractor_id');
        if (!$contractorId) {
            return redirect('/login?type=contractor')
                ->with('error', 'Veuillez vous connecter en tant que contractant.');
        }

        $recent = StatReport::where('contractor_id', $contractorId)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id'         => $r->id,
                'date'       => $r->created_at->format('d/m/Y'),
                'trir'       => $r->trir,
                'ltir'       => $r->ltir,
                'dart'       => $r->dart,
                'totalHours' => $r->total_hours,
            ]);

        return Inertia::render('Contractor/StatsForm', [
            'issuedAt' => now()->format('d/m/Y'),
            'reports'  => $recent,
        ]);
    }

    /** Store the payload + compute indicators + generate PDF. */
    public function store(Request $request): RedirectResponse
    {
        $contractorId = session('contractor_id');
        if (!$contractorId) {
            return redirect('/login?type=contractor')
                ->with('error', 'Veuillez vous connecter en tant que contractant.');
        }

        $validated = $request->validate([
            'payload' => ['required', 'array'],
        ]);
        $p = $validated['payload'];

        // Extract pieces used to compute KPIs
        $acc  = $p['accidents'] ?? [];
        $pers = $p['personnel'] ?? [];

        $heuresNorm  = (int)($pers['heuresNormales'] ?? 0);
        $heuresSup   = (int)($pers['heuresSup'] ?? 0);
        $totalHeures = $heuresNorm + $heuresSup;

        $recordables = (int)($acc['mortel'] ?? 0)
                     + (int)($acc['avecArret'] ?? 0)
                     + (int)($acc['soinsMedicaux'] ?? 0)
                     + (int)($acc['restrictionTemp'] ?? 0);

        $withArret = (int)($acc['avecArret'] ?? 0);
        $dartCases = $withArret + (int)($acc['restrictionTemp'] ?? 0);

        $factor = 200000;
        $trir = $totalHeures > 0 ? ($recordables * $factor) / $totalHeures : 0;
        $ltir = $totalHeures > 0 ? ($withArret   * $factor) / $totalHeures : 0;
        $dart = $totalHeures > 0 ? ($dartCases   * $factor) / $totalHeures : 0;

        $report = StatReport::create([
            'contractor_id' => $contractorId,
            'payload'       => $p,
            'trir'          => $trir,
            'ltir'          => $ltir,
            'dart'          => $dart,
            'total_hours'   => $totalHeures,
            'status'        => 'submitted',
        ]);

        // Generate PDF
        $html = view('pdf.stat_report', [
            'report'   => $report->fresh(),
            'payload'  => $p,
            'issuedAt' => now()->format('d/m/Y'),
        ])->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $pdfPath = "reports/statistiques_{$report->id}.pdf";
        Storage::put($pdfPath, $dompdf->output());
        $report->update(['pdf_path' => $pdfPath]);

        return redirect()->route('contractor.stats.history')
            ->with('success', 'Statistiques enregistrées et PDF généré.');
    }

    /** List history for contractor. */
    public function history(): InertiaResponse|RedirectResponse
    {
        $contractorId = session('contractor_id');
        if (!$contractorId) {
            return redirect('/login?type=contractor')
                ->with('error', 'Veuillez vous connecter en tant que contractant.');
        }

        $reports = StatReport::where('contractor_id', $contractorId)
            ->latest()
            ->paginate(10)
            ->through(function ($r) {
                return [
                    'id'         => $r->id,
                    'date'       => $r->created_at->format('d/m/Y'),
                    'trir'       => $r->trir,
                    'ltir'       => $r->ltir,
                    'dart'       => $r->dart,
                    'totalHours' => $r->total_hours,
                    'pdf'        => $r->pdf_path ? $r->pdf_path : null,
                ];
            });

        return Inertia::render('Contractor/StatsHistory', [
            'reports' => $reports,
        ]);
    }
}

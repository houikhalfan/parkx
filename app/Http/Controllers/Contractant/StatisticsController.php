<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\HseStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function show()
    {
        return Inertia::render('Contractant/Statistics/Index');
    }

    public function store(Request $r)
    {
        $r->validate([
            'site'                   => ['required','string','max:255'],
            'date'                   => ['required','date'], // Required since we combine it with current time
            'effectif_personnel'     => ['required','integer','min:0'],
            'heures_normales'        => ['required','numeric','min:0'],
            'heures_supplementaires' => ['required','numeric','min:0'],
            'accident_report'        => ['nullable','file','mimes:pdf,doc,docx','max:10240'], // 10MB max
            'inspection_report'      => ['nullable','file','mimes:pdf,doc,docx','max:10240'], // 10MB max
            'inspection_generales_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'inspection_engins_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'hygiene_base_vie_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'outils_electroportatifs_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'inspection_electriques_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'extincteurs_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'protections_collectives_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'epi_inspections_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'observations_hse_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
            'actions_correctives_cloturees_report' => ['nullable','file','mimes:pdf,doc,docx','max:10240'],
        ]);

        $data = $r->all();
        
        // Helper function to convert empty values to 0
        $n = fn($k) => (float)($data[$k] ?? 0);
        
        // Process all numeric fields to ensure they are not null
        $numericFields = [
            'effectif_personnel', 'heures_normales', 'heures_supplementaires', 'effectif_passant_horaire_normal',
            'acc_mortel', 'acc_arret', 'acc_soins_medicaux', 'acc_restriction_temporaire',
            'premier_soin', 'presque_accident', 'dommage_materiel', 'incident_environnemental',
            'nb_sensibilisations', 'personnes_sensibilisees',
            'inductions_total_personnes', 'formes_total_personnes', 'inductions_volume_heures',
            'excavation_sessions', 'excavation_participants', 'excavation_duree_h',
            'points_chauds_sessions', 'points_chauds_participants', 'points_chauds_duree_h',
            'espace_confine_sessions', 'espace_confine_participants', 'espace_confine_duree_h',
            'levage_sessions', 'levage_participants', 'levage_duree_h',
            'travail_hauteur_sessions', 'travail_hauteur_participants', 'travail_hauteur_duree_h',
            'sst_sessions', 'sst_participants', 'sst_duree_h',
            'epi_sessions', 'epi_participants', 'epi_duree_h',
            'modes_operatoires_sessions', 'modes_operatoires_participants', 'modes_operatoires_duree_h',
            'permis_spa_sessions', 'permis_spa_participants', 'permis_spa_duree_h',
            'outils_electroportatifs_sessions', 'outils_electroportatifs_participants', 'outils_electroportatifs_duree_h',
            'permis_general', 'permis_excavation', 'permis_point_chaud', 'permis_espace_confine',
            'permis_travail_hauteur', 'permis_levage', 'permis_consignation_loto', 'permis_electrique_sous_tension',
            'ptsr_total', 'ptsr_controles',
            'grue', 'niveleuse', 'pelle_hydraulique', 'tractopelle', 'chargeuse',
            'camion_citerne', 'camion_8x4', 'camion_remorque', 'grue_mobile', 'grue_tour',
            'compacteur', 'finisseur_enrobes', 'chariot_elevateur', 'foreuse_sondeuse',
            'brise_roche_hydraulique', 'pompe_a_beton', 'nacelle_ciseaux',
            'compresseur_air', 'groupe_electrogene_mobile',
            'inspections_generales', 'inspections_engins', 'hygiene_base_vie', 'outils_electroportatifs',
            'inspections_electriques', 'extincteurs', 'protections_collectives', 'epi_inspections',
            'observations_hse', 'actions_correctives_cloturees'
        ];
        
        // Ensure all numeric fields have default values
        foreach ($numericFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $data[$field] = 0;
            }
        }
        
        $total_heures = $n('heures_normales') + $n('heures_supplementaires');

        $recordables = (int)$n('acc_arret') + (int)$n('acc_soins_medicaux') + (int)$n('acc_restriction_temporaire');
        $dart_cas    = (int)$n('acc_arret') + (int)$n('acc_restriction_temporaire');
        $factor      = 200000;

        $trir = $total_heures > 0 ? ($recordables / $total_heures) * $factor : 0;
        $ltir = $total_heures > 0 ? ($n('acc_arret') / $total_heures) * $factor : 0;
        $dart = $total_heures > 0 ? ($dart_cas * $factor) / $total_heures : 0;

        $moy_sens = $n('effectif_personnel') > 0
            ? ($n('personnes_sensibilisees') / max($n('effectif_personnel'),1)) * 100
            : 0;

        $permis_specifiques_total = $n('permis_excavation') + $n('permis_point_chaud') + $n('permis_espace_confine')
            + $n('permis_travail_hauteur') + $n('permis_levage')
            + $n('permis_consignation_loto') + $n('permis_electrique_sous_tension');

        $permis_total = $n('permis_general') + $permis_specifiques_total;
        $ptsr_pct     = $n('ptsr_total') > 0 ? ($n('ptsr_controles') / max($n('ptsr_total'),1)) * 100 : 0;

        $inspections_total_hse =
              $n('inspections_generales') + $n('inspections_engins') + $n('hygiene_base_vie')
            + $n('outils_electroportatifs') + $n('inspections_electriques') + $n('extincteurs')
            + $n('protections_collectives') + $n('epi_inspections');

        $taux_fermeture = $n('observations_hse') > 0
            ? ($n('actions_correctives_cloturees') / max($n('observations_hse'),1)) * 100
            : 0;

        $ts = !empty($data['date']) ? Carbon::parse($data['date']) : Carbon::now();
        $now = Carbon::now();

        // Combine contractor's chosen date with current time
        if (!empty($data['date'])) {
            // Parse the contractor's chosen date
            $contractorDate = Carbon::parse($data['date']);
            
            // Create a new datetime with contractor's date but current time
            // Use UTC timezone to avoid timezone conversion issues
            $finalDateTime = Carbon::create(
                $contractorDate->year,
                $contractorDate->month,
                $contractorDate->day,
                $now->hour,
                $now->minute,
                $now->second,
                'UTC'
            );
        } else {
            $finalDateTime = $now;
        }

        // Handle file upload for accident report
        $accidentReportPath = null;
        if ($r->hasFile('accident_report')) {
            $file = $r->file('accident_report');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('accident_reports', $fileName, 'public');
            $accidentReportPath = $filePath;
        }

        // Handle file upload for inspection report
        $inspectionReportPath = null;
        if ($r->hasFile('inspection_report')) {
            $file = $r->file('inspection_report');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('inspection_reports', $fileName, 'public');
            $inspectionReportPath = $filePath;
        }

        // Handle file uploads for specific inspection types
        $inspectionGeneralesReportPath = null;
        $inspectionEnginsReportPath = null;
        $hygieneBaseVieReportPath = null;
        $outilsElectroportatifsReportPath = null;
        $inspectionElectriquesReportPath = null;
        $extincteursReportPath = null;
        $protectionsCollectivesReportPath = null;
        $epiInspectionsReportPath = null;
        $observationsHseReportPath = null;
        $actionsCorrectivesClotureesReportPath = null;

        // Process each specific inspection report
        $specificInspectionFields = [
            'inspection_generales_report' => 'inspection_generales_reports',
            'inspection_engins_report' => 'inspection_engins_reports',
            'hygiene_base_vie_report' => 'hygiene_base_vie_reports',
            'outils_electroportatifs_report' => 'outils_electroportatifs_reports',
            'inspection_electriques_report' => 'inspection_electriques_reports',
            'extincteurs_report' => 'extincteurs_reports',
            'protections_collectives_report' => 'protections_collectives_reports',
            'epi_inspections_report' => 'epi_inspections_reports',
            'observations_hse_report' => 'observations_hse_reports',
            'actions_correctives_cloturees_report' => 'actions_correctives_cloturees_reports'
        ];

        foreach ($specificInspectionFields as $fieldName => $storageFolder) {
            if ($r->hasFile($fieldName)) {
                $file = $r->file($fieldName);
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs($storageFolder, $fileName, 'public');
                
                // Set the corresponding variable
                switch ($fieldName) {
                    case 'inspection_generales_report':
                        $inspectionGeneralesReportPath = $filePath;
                        break;
                    case 'inspection_engins_report':
                        $inspectionEnginsReportPath = $filePath;
                        break;
                    case 'hygiene_base_vie_report':
                        $hygieneBaseVieReportPath = $filePath;
                        break;
                    case 'outils_electroportatifs_report':
                        $outilsElectroportatifsReportPath = $filePath;
                        break;
                    case 'inspection_electriques_report':
                        $inspectionElectriquesReportPath = $filePath;
                        break;
                    case 'extincteurs_report':
                        $extincteursReportPath = $filePath;
                        break;
                    case 'protections_collectives_report':
                        $protectionsCollectivesReportPath = $filePath;
                        break;
                    case 'epi_inspections_report':
                        $epiInspectionsReportPath = $filePath;
                        break;
                    case 'observations_hse_report':
                        $observationsHseReportPath = $filePath;
                        break;
                    case 'actions_correctives_cloturees_report':
                        $actionsCorrectivesClotureesReportPath = $filePath;
                        break;
                }
            }
        }

        // Remove the date field from data to ensure our timestamp is used
        unset($data['date']);

        $statistics = HseStat::create(array_merge($data, [
            'user_id'                         => Auth::guard('contractor')->id(),
            'user_type'                       => 'contractor',
            'date'                            => $finalDateTime, // Contractor's date + current time
            'accident_report'                 => $accidentReportPath,
            'inspection_report'               => $inspectionReportPath,
            'inspection_generales_report'     => $inspectionGeneralesReportPath,
            'inspection_engins_report'        => $inspectionEnginsReportPath,
            'hygiene_base_vie_report'         => $hygieneBaseVieReportPath,
            'outils_electroportatifs_report'  => $outilsElectroportatifsReportPath,
            'inspection_electriques_report'   => $inspectionElectriquesReportPath,
            'extincteurs_report'              => $extincteursReportPath,
            'protections_collectives_report'  => $protectionsCollectivesReportPath,
            'epi_inspections_report'          => $epiInspectionsReportPath,
            'observations_hse_report'         => $observationsHseReportPath,
            'actions_correctives_cloturees_report' => $actionsCorrectivesClotureesReportPath,
            'total_heures'                    => $total_heures,
            'trir'                            => $trir,
            'ltir'                            => $ltir,
            'dart'                            => $dart,
            'moyenne_sensibilisation_pourcent'=> $moy_sens,
            'permis_specifiques_total'        => $permis_specifiques_total,
            'permis_total'                    => $permis_total,
            'ptsr_controles_pourcent'         => $ptsr_pct,
            'inspections_total_hse'           => $inspections_total_hse,
            'taux_fermeture_actions_pourcent' => $taux_fermeture,
            'due_year'                        => (int)$finalDateTime->year,
            'due_month'                       => (int)$finalDateTime->month,
            'week_of_year'                    => (int)$finalDateTime->weekOfYear,
            'created_at'                      => $now,
            'updated_at'                      => $now,
        ]));

        // Send notification to all admins
        $contractor = Auth::guard('contractor')->user();
        $admins = \App\Models\Admin::all();
        
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\StatisticsSubmitted($statistics, $contractor));
        }

        return redirect()->route('contractant.statistiques.history')
            ->with('success', 'Statistiques enregistrées.');
    }

    public function history()
    {
        $uid = Auth::guard('contractor')->id();

        // Check if this is an AJAX request for data
        if (request()->wantsJson()) {
            return response()->json([
                'stats' => \App\Models\HseStat::query()
                    ->where('user_id', $uid)
                    ->latest('date')->latest('id')
                    ->select([
                        'id','site','date','created_at',
                        'total_heures','trir','ltir','dart',
                        'permis_total','inspections_total_hse'
                    ])
                    ->limit(200)
                    ->get(),
            ]);
        }

        // Regular page request
        return Inertia::render('Contractant/Statistics/History', [
            'records' => \App\Models\HseStat::query()
                ->where('user_id', $uid)              // ✅ only my records
                ->latest('date')->latest('id')
                ->select([
                    'id','site','date','created_at',
                    'total_heures','trir','ltir','dart',
                    'permis_total','inspections_total_hse'
                ])
                ->limit(200)
                ->get(),
        ]); 
    }
}

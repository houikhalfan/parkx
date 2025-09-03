<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hse_stats', function (Blueprint $table) {
            $table->string('inspection_generales_report')->nullable()->after('inspection_report');
            $table->string('inspection_engins_report')->nullable()->after('inspection_generales_report');
            $table->string('hygiene_base_vie_report')->nullable()->after('inspection_engins_report');
            $table->string('outils_electroportatifs_report')->nullable()->after('hygiene_base_vie_report');
            $table->string('inspection_electriques_report')->nullable()->after('outils_electroportatifs_report');
            $table->string('extincteurs_report')->nullable()->after('inspection_electriques_report');
            $table->string('protections_collectives_report')->nullable()->after('extincteurs_report');
            $table->string('epi_inspections_report')->nullable()->after('protections_collectives_report');
            $table->string('observations_hse_report')->nullable()->after('epi_inspections_report');
            $table->string('actions_correctives_cloturees_report')->nullable()->after('observations_hse_report');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hse_stats', function (Blueprint $table) {
            $table->dropColumn([
                'inspection_generales_report',
                'inspection_engins_report',
                'hygiene_base_vie_report',
                'outils_electroportatifs_report',
                'inspection_electriques_report',
                'extincteurs_report',
                'protections_collectives_report',
                'epi_inspections_report',
                'observations_hse_report',
                'actions_correctives_cloturees_report'
            ]);
        });
    }
};

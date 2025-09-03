<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('hse_stats', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('site_id')->nullable()->constrained('sites')->nullOnDelete();
            $t->string('site')->nullable(); // keep plain text site too (from dropdown)
            $t->date('date');

            // Période & Heures
            $t->integer('effectif_personnel')->default(0);
            $t->decimal('heures_normales',10,2)->default(0);
            $t->decimal('heures_supplementaires',10,2)->default(0);
            $t->integer('effectif_passant_horaire_normal')->default(0);
            $t->decimal('total_heures',10,2)->default(0);

            // Accidents / Incidents
            $t->unsignedInteger('acc_mortel')->default(0);
            $t->unsignedInteger('acc_arret')->default(0);
            $t->unsignedInteger('acc_soins_medicaux')->default(0);
            $t->unsignedInteger('acc_restriction_temporaire')->default(0);
            $t->unsignedInteger('premier_soin')->default(0);
            $t->unsignedInteger('presque_accident')->default(0);
            $t->unsignedInteger('dommage_materiel')->default(0);
            $t->unsignedInteger('incident_environnemental')->default(0);

            // Indicateurs
            $t->decimal('trir',10,4)->default(0);
            $t->decimal('ltir',10,4)->default(0);
            $t->decimal('dart',10,4)->default(0);

            // Sensibilisation
            $t->unsignedInteger('nb_sensibilisations')->default(0);
            $t->unsignedInteger('personnes_sensibilisees')->default(0);
            $t->decimal('moyenne_sensibilisation_pourcent',6,2)->default(0);

            // Totaux inductions/formations
            $t->unsignedInteger('inductions_total_personnes')->default(0);
            $t->unsignedInteger('formes_total_personnes')->default(0);
            $t->decimal('inductions_volume_heures',10,2)->default(0);

            // Formations par thème (sessions/participants/duree_h) – 10 thèmes:
            $themes = ['excavation','points_chauds','espace_confine','levage','travail_hauteur','sst','epi','modes_operatoires','permis_spa','outils_electroportatifs'];
            foreach ($themes as $x) {
                $t->unsignedInteger("{$x}_sessions")->default(0);
                $t->unsignedInteger("{$x}_participants")->default(0);
                $t->decimal("{$x}_duree_h",10,2)->default(0);
            }
            $t->unsignedInteger('formations_total_seances')->default(0);
            $t->unsignedInteger('formations_total_participants')->default(0);
            $t->decimal('formations_total_heures',10,2)->default(0);

            // Permis & PTSR
            $t->unsignedInteger('permis_general')->default(0);
            $t->unsignedInteger('permis_excavation')->default(0);
            $t->unsignedInteger('permis_point_chaud')->default(0);
            $t->unsignedInteger('permis_espace_confine')->default(0);
            $t->unsignedInteger('permis_travail_hauteur')->default(0);
            $t->unsignedInteger('permis_levage')->default(0);
            $t->unsignedInteger('permis_consignation_loto')->default(0);
            $t->unsignedInteger('permis_electrique_sous_tension')->default(0);
            $t->unsignedInteger('permis_specifiques_total')->default(0);
            $t->unsignedInteger('permis_total')->default(0);
            $t->unsignedInteger('ptsr_total')->default(0);
            $t->unsignedInteger('ptsr_controles')->default(0);
            $t->decimal('ptsr_controles_pourcent',6,2)->default(0);

            // Engins
            $engins = ['grue','niveleuse','pelle_hydraulique','tractopelle','chargeuse','camion_citerne','camion_8x4','camion_remorque','grue_mobile','grue_tour','compacteur','finisseur_enrobes','chariot_elevateur','foreuse_sondeuse','brise_roche_hydraulique','pompe_a_beton','nacelle_ciseaux'];
            foreach ($engins as $e) $t->unsignedInteger($e)->default(0);

            // Matériels
            $t->unsignedInteger('compresseur_air')->default(0);
            $t->unsignedInteger('groupe_electrogene_mobile')->default(0);

            // Inspections & Obs
            $t->unsignedInteger('inspections_generales')->default(0);
            $t->unsignedInteger('inspections_engins')->default(0);
            $t->unsignedInteger('hygiene_base_vie')->default(0);
            $t->unsignedInteger('outils_electroportatifs')->default(0);
            $t->unsignedInteger('inspections_electriques')->default(0);
            $t->unsignedInteger('extincteurs')->default(0);
            $t->unsignedInteger('protections_collectives')->default(0);
            $t->unsignedInteger('epi_inspections')->default(0);
            $t->unsignedInteger('observations_hse')->default(0);
            $t->unsignedInteger('actions_correctives_cloturees')->default(0);
            $t->unsignedInteger('inspections_total_hse')->default(0);
            $t->decimal('taux_fermeture_actions_pourcent',6,2)->default(0);

            // analytics helpers
            $t->smallInteger('due_year')->nullable()->index();
            $t->tinyInteger('due_month')->nullable()->index();
            $t->smallInteger('week_of_year')->nullable()->index();

            $t->timestamps();
            $t->index(['site','date']);
        });
    }
    public function down(): void { Schema::dropIfExists('hse_stats'); }
};

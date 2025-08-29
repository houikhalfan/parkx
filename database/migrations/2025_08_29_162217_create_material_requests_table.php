<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('material_requests', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('contractor_id'); // auth:contractor
            $t->unsignedBigInteger('site_id');       // belongs to a site
            $t->string('status')->default('pending'); // pending|accepted|rejected

            // 4 files
            $t->string('controle_reglementaire_path');
            $t->string('assurance_path');
            $t->string('habilitation_conducteur_path');
            $t->string('rapports_conformite_path');

            // decision
            $t->unsignedBigInteger('decided_by_user_id')->nullable(); // ParkX user (responsable)
            $t->timestamp('decided_at')->nullable();
            $t->text('decision_comment')->nullable();

            // QR
            $t->string('qr_token')->nullable()->unique();

            $t->timestamps();

            // indexes (FKs optional if you want cascading)
            $t->index('contractor_id');
            $t->index('site_id');
            $t->index('decided_by_user_id');
            $t->index('status');
            $t->index('qr_token');
        });
    }

    public function down(): void {
        Schema::dropIfExists('material_requests');
    }
};

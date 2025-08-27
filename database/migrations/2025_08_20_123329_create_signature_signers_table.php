<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('signature_signers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('signature_request_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('email')->nullable();
            $t->unsignedInteger('sign_order')->default(1);
            $t->timestamp('signed_at')->nullable();
            $t->string('signature_image_path')->nullable(); // image (dessin/texte rendu)
            $t->string('signature_text')->nullable();       // texte brut si utile
            $t->string('signed_ip')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('signature_signers');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('signer_tokens', function (Blueprint $t) {
            $t->id();
            $t->foreignId('signature_signer_id')->constrained('signature_signers')->cascadeOnDelete();
            $t->string('token')->unique();  // SHA-256 du jeton brut
            $t->timestamp('expires_at');
            $t->timestamp('used_at')->nullable(); // marqué à la soumission
            $t->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('signer_tokens');
    }
};

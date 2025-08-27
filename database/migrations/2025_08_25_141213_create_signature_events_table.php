// database/migrations/2025_08_20_000011_create_signature_events_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('signature_events', function (Blueprint $t) {
      $t->id();
      $t->foreignId('signature_request_id')->constrained()->cascadeOnDelete();
      $t->string('event'); // submitted, assigned, signed, rejected, replaced_original, viewed, downloaded
      $t->string('actor_type')->nullable(); // Admin|User|Contractant
      $t->unsignedBigInteger('actor_id')->nullable();
      $t->json('meta')->nullable(); // any extra info
      $t->timestamps();
    });
  }
  public function down(): void {
    Schema::dropIfExists('signature_events');
  }
};

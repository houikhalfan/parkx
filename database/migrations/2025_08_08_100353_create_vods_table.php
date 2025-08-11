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
       Schema::create('vods', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->date('date');
    $table->string('projet');
    $table->string('activite');
    $table->string('observateur');
    $table->json('personnes_observees');
    $table->json('entreprise_observee');
    $table->json('pratiques')->nullable();
    $table->json('comportements')->nullable();
    $table->json('conditions')->nullable();
    $table->json('correctives')->nullable();
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vods');
    }
};

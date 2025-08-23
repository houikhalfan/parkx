<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stat_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_id')->constrained('contractors')->cascadeOnDelete();

            // we keep the full form as JSON so you can extend fields freely
            $table->json('payload');

            // KPIs we compute server-side for admin listing
            $table->decimal('trir', 8, 4)->nullable();
            $table->decimal('ltir', 8, 4)->nullable();
            $table->decimal('dart', 8, 4)->nullable();

            // quick access numbers
            $table->unsignedInteger('total_hours')->default(0);

            // path to the generated pdf (storage/app/...)
            $table->string('pdf_path')->nullable();

            // optional status if you want review workflow later
            $table->string('status')->default('submitted');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stat_reports');
    }
};

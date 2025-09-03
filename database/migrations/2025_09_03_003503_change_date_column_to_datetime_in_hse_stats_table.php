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
            // Change date column from DATE to DATETIME to store both date and time
            $table->dateTime('date')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hse_stats', function (Blueprint $table) {
            // Revert back to DATE type
            $table->date('date')->change();
        });
    }
};

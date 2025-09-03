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
            // Remove the foreign key constraint on user_id since we now have user_type
            // to distinguish between users and contractors
            $table->dropForeign(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hse_stats', function (Blueprint $table) {
            // Restore the foreign key constraint if rolling back
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};

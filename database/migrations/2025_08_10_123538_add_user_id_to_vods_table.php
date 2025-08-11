<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            // add only if it does not exist already
            if (!Schema::hasColumn('vods', 'user_id')) {
                $table->foreignId('user_id')
                      ->after('id')
                      ->constrained()
                      ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            if (Schema::hasColumn('vods', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });
    }
};

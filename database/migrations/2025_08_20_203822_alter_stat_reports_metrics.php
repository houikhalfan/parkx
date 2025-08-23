<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('stat_reports', function (Blueprint $table) {
            // Big enough for worst cases
            $table->double('trir', 15, 4)->change();
            $table->double('ltir', 15, 4)->change();
            $table->double('dart', 15, 4)->change();
        });
    }

    public function down(): void
    {
        Schema::table('stat_reports', function (Blueprint $table) {
            $table->double('trir', 8, 2)->change();
            $table->double('ltir', 8, 2)->change();
            $table->double('dart', 8, 2)->change();
        });
    }
};

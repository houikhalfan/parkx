<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'site_id')) {
                $table->foreignId('site_id')->nullable()
                    ->after('email')
                    ->constrained('sites')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'site_id')) {
                $table->dropConstrainedForeignId('site_id');
            }
        });
    }
};

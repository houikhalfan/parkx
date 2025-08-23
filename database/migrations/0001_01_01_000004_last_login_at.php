<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'last_login_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('last_login_at')->nullable()->after('remember_token');
            });
        }

        if (!Schema::hasColumn('contractors', 'last_login_at')) {
            Schema::table('contractors', function (Blueprint $table) {
                $table->timestamp('last_login_at')->nullable()->after('is_approved');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'last_login_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('last_login_at');
            });
        }
        if (Schema::hasColumn('contractors', 'last_login_at')) {
            Schema::table('contractors', function (Blueprint $table) {
                $table->dropColumn('last_login_at');
            });
        }
    }
};

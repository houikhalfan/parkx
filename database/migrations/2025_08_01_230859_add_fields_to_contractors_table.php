<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Only alter if the table exists
        if (!Schema::hasTable('contractors')) {
            // If you actually expect it to exist, bail out quietly
            return;
        }

        Schema::table('contractors', function (Blueprint $table) {
            if (!Schema::hasColumn('contractors', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('contractors', 'company_name')) {
                $table->string('company_name')->nullable();
            }
            if (!Schema::hasColumn('contractors', 'role')) {
                $table->string('role')->nullable();
            }
            if (!Schema::hasColumn('contractors', 'is_approved')) {
                $table->boolean('is_approved')->default(false);
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('contractors')) {
            return;
        }

        Schema::table('contractors', function (Blueprint $table) {
            if (Schema::hasColumn('contractors', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('contractors', 'company_name')) {
                $table->dropColumn('company_name');
            }
            if (Schema::hasColumn('contractors', 'role')) {
                $table->dropColumn('role');
            }
            if (Schema::hasColumn('contractors', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};

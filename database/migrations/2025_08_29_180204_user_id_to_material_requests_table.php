<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('material_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('material_requests', 'assigned_user_id')) {
                $table->unsignedBigInteger('assigned_user_id')->nullable()->after('site_id');
                $table->foreign('assigned_user_id')->references('id')->on('users')->nullOnDelete();
            }
        });

        // Optional but handy: backfill for existing rows based on the site’s responsible
        // Works on MySQL
        DB::statement("
            UPDATE material_requests mr
            LEFT JOIN sites s ON s.id = mr.site_id
            SET mr.assigned_user_id = s.responsible_user_id
            WHERE mr.assigned_user_id IS NULL
        ");
    }

    public function down(): void
    {
        Schema::table('material_requests', function (Blueprint $table) {
            if (Schema::hasColumn('material_requests', 'assigned_user_id')) {
                $table->dropForeign(['assigned_user_id']);
                $table->dropColumn('assigned_user_id');
            }
        });
    }
};


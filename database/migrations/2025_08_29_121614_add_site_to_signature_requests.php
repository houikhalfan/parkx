<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('signature_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('signature_requests', 'site_id')) {
                $table->foreignId('site_id')->nullable()->constrained('sites')->nullOnDelete()->after('status');
            }
        
        });
    }

    public function down(): void
    {
        Schema::table('signature_requests', function (Blueprint $table) {
         
            if (Schema::hasColumn('signature_requests', 'site_id')) {
                $table->dropConstrainedForeignId('site_id');
            }
        });
    }
};

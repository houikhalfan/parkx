<?php

// database/migrations/xxxx_add_qr_to_material_requests.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('material_requests', function (Blueprint $t) {
            $t->text('qrcode_text')->nullable();
            $t->timestamp('decided_at')->nullable();
        });
    }
    public function down(): void {
        Schema::table('material_requests', function (Blueprint $t) {
            $t->dropColumn(['qrcode_path','qrcode_text','decided_by_user_id','decided_at']);
        });
    }
};


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::table('signature_requests', function (Blueprint $t) {
      if (!Schema::hasColumn('signature_requests','status')) {
        $t->enum('status', ['submitted','assigned','signed','rejected'])->default('submitted');
      }
      if (!Schema::hasColumn('signature_requests','assigned_user_id')) {
        $t->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
      }
      if (!Schema::hasColumn('signature_requests','signed_path')) {
        $t->string('signed_path')->nullable();
      }
      if (!Schema::hasColumn('signature_requests','original_sha256')) {
        $t->string('original_sha256', 64)->nullable();
      }
      if (!Schema::hasColumn('signature_requests','deleted_original_at')) {
        $t->timestamp('deleted_original_at')->nullable();
      }
    });
  }

  public function down(): void {
    Schema::table('signature_requests', function (Blueprint $t) {
      $t->dropConstrainedForeignId('assigned_user_id');
      $t->dropColumn(['status','signed_path','original_sha256','deleted_original_at']);
    });
  }
};

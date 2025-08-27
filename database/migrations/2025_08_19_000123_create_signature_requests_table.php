<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('signature_requests')) {
            Schema::create('signature_requests', function (Blueprint $table) {
                $table->id(); // BIGINT UNSIGNED
                $table->foreignId('contractor_id')->constrained('contractors')->cascadeOnDelete();
                $table->foreignId('admin_id')->nullable()->constrained('admins')->nullOnDelete();

                $table->string('title');
                $table->text('message')->nullable();

                $table->string('original_path'); // uploaded by contractor
                $table->string('signed_path')->nullable(); // file signed by admin

                $table->string('status', 20)->default('pending')->index(); // pending|signed|rejected
                $table->timestamp('signed_at')->nullable();
                $table->timestamp('rejected_at')->nullable();

                $table->json('meta')->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->index(['contractor_id', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('signature_requests');
    }
};

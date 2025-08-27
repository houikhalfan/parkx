<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('signature_request_comments')) {
            Schema::create('signature_request_comments', function (Blueprint $table) {
                $table->id();

                // FK -> signature_requests.id (MUST match type: unsignedBigInteger)
                $table->unsignedBigInteger('signature_request_id');

                // polymorphic author: Admin or Contractor
                $table->morphs('author'); // author_type (string), author_id (unsignedBigInteger)

                $table->text('body');
                $table->timestamps();

                $table->index(['signature_request_id', 'created_at']);

                $table->foreign('signature_request_id')
                    ->references('id')->on('signature_requests')
                    ->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('signature_request_comments');
    }
};

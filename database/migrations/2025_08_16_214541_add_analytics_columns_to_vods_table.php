<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            // --- Denormalized time buckets (derived from `date`) ---
            if (!Schema::hasColumn('vods', 'due_year')) {
                $table->unsignedSmallInteger('due_year')->nullable()->after('date');
            }
            if (!Schema::hasColumn('vods', 'due_month')) {
                $table->unsignedTinyInteger('due_month')->nullable()->after('due_year'); // 1..12
            }
            if (!Schema::hasColumn('vods', 'week_of_year')) {
                $table->unsignedTinyInteger('week_of_year')->nullable()->after('due_month'); // 1..53
            }

            // --- Completion signal ---
            if (!Schema::hasColumn('vods', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('week_of_year');
            }

            // --- Risk/conditions summaries (optional JSON you can fill from your existing fields) ---
            if (!Schema::hasColumn('vods', 'has_danger')) {
                $table->boolean('has_danger')->default(false)->after('completed_at');
            }
            if (!Schema::hasColumn('vods', 'danger_count')) {
                $table->unsignedSmallInteger('danger_count')->default(0)->after('has_danger');
            }
            if (!Schema::hasColumn('vods', 'risk_breakdown')) {
                $table->json('risk_breakdown')->nullable()->after('danger_count'); // e.g. {"EPI":2,"Outillage":1}
            }

            // --- Storage helpers (optional; adjust to your storage shape) ---
            if (!Schema::hasColumn('vods', 'pdf_path')) {
                $table->string('pdf_path', 512)->nullable()->after('risk_breakdown');
            }
            if (!Schema::hasColumn('vods', 'thumb_path')) {
                $table->string('thumb_path', 512)->nullable()->after('pdf_path');
            }

            // --- Helpful indexes ---
            $table->index(['due_year', 'due_month']);
            $table->index('week_of_year');
            $table->index('has_danger');
            $table->index('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            // drop indexes first where named implicitly
            $table->dropIndex(['due_year', 'due_month']);
            $table->dropIndex(['week_of_year']);
            $table->dropIndex(['has_danger']);
            $table->dropIndex(['completed_at']);

            foreach ([
                'due_year','due_month','week_of_year',
                'completed_at',
                'has_danger','danger_count','risk_breakdown',
                'pdf_path','thumb_path',
            ] as $col) {
                if (Schema::hasColumn('vods', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};

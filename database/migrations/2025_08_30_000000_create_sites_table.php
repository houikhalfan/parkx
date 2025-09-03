<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('sites', function (Blueprint $t) {
            $t->id();
            $t->string('name')->unique();
            $t->timestamps();
        });

        DB::table('sites')->insert([
            ['name'=>'Benguerir'],
            ['name'=>'Alyoussofia'],
            ['name'=>'Kheribga'],
            ['name'=>'Jerf Sfer'],
            ['name'=>'Asfi'],
        ]);
    }
    public function down(): void { Schema::dropIfExists('sites'); }
};

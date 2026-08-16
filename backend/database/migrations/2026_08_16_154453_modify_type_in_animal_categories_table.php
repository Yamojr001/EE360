<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('animal_categories', function (Blueprint $table) {
            $table->string('type', 50)->default('animal')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('animal_categories', function (Blueprint $table) {
            $table->enum('type', ['animal', 'product'])->default('animal')->change();
        });
    }
};

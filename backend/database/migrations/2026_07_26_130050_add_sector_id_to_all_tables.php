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
        $tables = [
            'inventory_items', 'workers', 'animals', 'sales', 'expenses',
            'water_productions', 'water_sales', 'water_expenses', 'users'
        ];

        foreach ($tables as $t) {
            Schema::table($t, function (Blueprint $table) {
                $table->unsignedBigInteger('sector_id')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'inventory_items', 'workers', 'animals', 'sales', 'expenses',
            'water_productions', 'water_sales', 'water_expenses', 'users'
        ];

        foreach ($tables as $t) {
            Schema::table($t, function (Blueprint $table) {
                $table->dropColumn('sector_id');
            });
        }
    }
};

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
        Schema::table('water_productions', function (Blueprint $table) {
            $table->decimal('price_per_bag', 10, 2)->nullable()->default(0)->after('cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('water_productions', function (Blueprint $table) {
            $table->dropColumn('price_per_bag');
        });
    }
};

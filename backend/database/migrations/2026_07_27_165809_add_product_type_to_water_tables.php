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
            $table->string('product_type')->default('sachet')->after('date');
            $table->string('unit')->default('bags')->after('product_type');
            // 'bags_produced' is now somewhat generic, we can keep it as is but treat it as quantity
        });

        Schema::table('water_sales', function (Blueprint $table) {
            $table->string('product_type')->default('sachet')->after('date');
            $table->string('unit')->default('bags')->after('product_type');
        });
    }

    public function down(): void
    {
        Schema::table('water_productions', function (Blueprint $table) {
            $table->dropColumn(['product_type', 'unit']);
        });
        Schema::table('water_sales', function (Blueprint $table) {
            $table->dropColumn(['product_type', 'unit']);
        });
    }
};

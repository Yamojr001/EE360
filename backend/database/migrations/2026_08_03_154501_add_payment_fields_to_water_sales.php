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
        Schema::table('water_sales', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('distribution_area');
            $table->string('payment_status')->default('paid')->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('water_sales', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'payment_status']);
        });
    }
};

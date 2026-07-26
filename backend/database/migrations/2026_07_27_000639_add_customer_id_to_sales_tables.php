<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable()->after('buyer');
        });
        
        Schema::table('water_sales', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable()->after('buyer');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('customer_id');
        });
        Schema::table('water_sales', function (Blueprint $table) {
            $table->dropColumn('customer_id');
        });
    }
};

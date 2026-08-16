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
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('amount_paid', 12, 2)->nullable()->after('total_amount');
            $table->string('payment_status')->default('paid')->after('amount_paid');
        });

        Schema::table('water_sales', function (Blueprint $table) {
            $table->decimal('amount_paid', 12, 2)->nullable()->after('total_amount');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['amount_paid', 'payment_status']);
        });

        Schema::table('water_sales', function (Blueprint $table) {
            $table->dropColumn('amount_paid');
        });
    }
};

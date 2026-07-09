<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('water_productions', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedInteger('bags_produced')->default(0);
            $table->decimal('liters_used', 10, 2)->default(0);
            $table->decimal('cost', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('date');
        });

        Schema::create('water_sales', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedInteger('quantity')->default(0);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('buyer', 100)->nullable();
            $table->string('distribution_area', 100)->nullable();
            $table->timestamps();
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('water_sales');
        Schema::dropIfExists('water_productions');
    }
};

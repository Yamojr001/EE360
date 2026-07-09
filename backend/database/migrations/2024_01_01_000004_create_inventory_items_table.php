<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('category', 80);
            $table->decimal('quantity', 12, 2)->default(0);
            $table->string('unit', 30)->nullable();
            $table->decimal('unit_cost', 12, 2)->default(0);
            $table->decimal('min_stock_level', 12, 2)->default(0);
            $table->string('supplier', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};

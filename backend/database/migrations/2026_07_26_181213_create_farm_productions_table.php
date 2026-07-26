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
        Schema::create('farm_productions', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('category_id')->nullable(); // references animal_categories
            $table->string('item_name')->nullable(); // fallback if category is deleted/not used
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->nullable(); // pieces, liters, trays, kg, etc.
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('sector_id')->default(1);
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farm_productions');
    }
};

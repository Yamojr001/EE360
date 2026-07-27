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
        Schema::create('hatchery_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sector_id')->default(1);
            $table->date('date');
            $table->string('batch_number')->nullable();
            $table->string('animal_type');
            $table->integer('eggs_set')->default(0);
            $table->integer('eggs_hatched')->default(0);
            $table->integer('mortality')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hatchery_records');
    }
};

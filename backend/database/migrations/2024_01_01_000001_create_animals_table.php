<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50);        // chicken, goat, sheep, ram, rabbit, fish, parrot
            $table->string('tag_id', 50)->nullable();
            $table->string('breed', 100)->nullable();
            $table->unsignedInteger('age_months')->default(0);
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('status', ['active', 'sick', 'sold', 'deceased'])->default('active');
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('current_value', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('category', 80);    // feed, medicine, equipment, labour, transport, utilities, maintenance, other
            $table->string('description', 300);
            $table->decimal('amount', 12, 2);
            $table->string('vendor', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('date');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};

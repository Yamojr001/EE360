<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('role', 80);
            $table->string('phone', 20)->nullable();
            $table->decimal('salary', 12, 2)->default(0);
            $table->date('hire_date')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->string('address', 200)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workers');
    }
};

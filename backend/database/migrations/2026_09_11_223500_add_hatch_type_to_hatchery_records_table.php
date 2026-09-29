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
        Schema::table('hatchery_records', function (Blueprint $table) {
            $table->string('hatch_type', 20)->default('internal')->after('animal_type');
            $table->string('external_provider', 255)->nullable()->after('hatch_type');
            $table->string('external_contact', 100)->nullable()->after('external_provider');
            $table->decimal('cost', 12, 2)->nullable()->default(0.00)->after('external_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hatchery_records', function (Blueprint $table) {
            $table->dropColumn(['hatch_type', 'external_provider', 'external_contact', 'cost']);
        });
    }
};

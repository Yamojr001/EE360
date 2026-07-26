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
        Schema::table('water_productions', function (Blueprint $table) {
            $table->unsignedInteger('bags_wasted')->default(0)->after('bags_produced');
            $table->text('waste_reason')->nullable()->after('bags_wasted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('water_productions', function (Blueprint $table) {
            $table->dropColumn(['bags_wasted', 'waste_reason']);
        });
    }
};

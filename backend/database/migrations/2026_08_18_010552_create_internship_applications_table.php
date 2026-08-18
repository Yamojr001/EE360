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
        Schema::create('internship_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('institution')->nullable();
            $table->string('course_of_study')->nullable();
            $table->string('application_type'); // 'siwes', 'internship', 'nysc'
            $table->string('duration_months')->nullable(); // e.g. '3 months', '6 months', '1 year'
            $table->date('start_date')->nullable();
            $table->string('passport_photo')->nullable();
            $table->string('document_path')->nullable(); // CV / Recommendation letter
            $table->text('cover_letter')->nullable();
            $table->string('status')->default('pending'); // 'pending', 'accepted', 'rejected'
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('application_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value')->nullable();
            $table->timestamps();
        });

        // Default application portal settings (all open by default)
        \Illuminate\Support\Facades\DB::table('application_settings')->insert([
            ['key' => 'siwes_open', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'internship_open', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'nysc_open', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internship_applications');
        Schema::dropIfExists('application_settings');
    }
};

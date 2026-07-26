<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SectorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Sector::firstOrCreate(['slug' => 'farm'], [
            'name' => 'Farm Operations',
            'description' => 'Livestock, crops, and general farm management'
        ]);

        \App\Models\Sector::firstOrCreate(['slug' => 'water'], [
            'name' => 'Water Production',
            'description' => 'Water packaging and sales'
        ]);
    }
}

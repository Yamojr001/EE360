<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimalCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Chicken', 'type' => 'animal', 'sector_id' => 1],
            ['name' => 'Goat', 'type' => 'animal', 'sector_id' => 1],
            ['name' => 'Sheep', 'type' => 'animal', 'sector_id' => 1],
            ['name' => 'Eggs', 'type' => 'product', 'sector_id' => 1],
            ['name' => 'Milk', 'type' => 'product', 'sector_id' => 1],
        ];

        foreach ($categories as $cat) {
            \App\Models\AnimalCategory::firstOrCreate(['name' => $cat['name'], 'sector_id' => $cat['sector_id']], $cat);
        }
    }
}

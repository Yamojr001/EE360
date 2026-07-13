<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ee360.farm'],
            [
                'name'     => 'Farm Administrator',
                'password' => Hash::make('password'),
                'role'     => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'farm@ee360.farm'],
            [
                'name'     => 'Farm Manager',
                'password' => Hash::make('password'),
                'role'     => 'farm_manager',
            ]
        );

        User::updateOrCreate(
            ['email' => 'water@ee360.farm'],
            [
                'name'     => 'Water Manager',
                'password' => Hash::make('password'),
                'role'     => 'water_manager',
            ]
        );
    }
}

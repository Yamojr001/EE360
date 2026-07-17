<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Sales count: " . App\Models\Sale::count() . "\n";
echo "WaterSales count: " . App\Models\WaterSale::count() . "\n";
echo "WaterExpenses count: " . App\Models\WaterExpense::count() . "\n";

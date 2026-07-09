<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $table = 'inventory_items';

    protected $fillable = [
        'name', 'category', 'quantity', 'unit',
        'unit_cost', 'min_stock_level', 'supplier', 'notes',
    ];

    protected $casts = [
        'quantity'        => 'decimal:2',
        'unit_cost'       => 'decimal:2',
        'min_stock_level' => 'decimal:2',
    ];
}

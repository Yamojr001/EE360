<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaterSale extends Model
{
    use HasFactory;

    protected $table = 'water_sales';

    protected $fillable = [
        'date', 'quantity', 'unit_price', 'total_amount',
        'buyer', 'distribution_area',
    ];

    protected $casts = [
        'date'         => 'date',
        'quantity'     => 'integer',
        'unit_price'   => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];
}

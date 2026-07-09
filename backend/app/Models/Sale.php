<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'category', 'item', 'quantity', 'unit',
        'unit_price', 'total_amount', 'buyer', 'notes',
    ];

    protected $casts = [
        'date'         => 'date',
        'quantity'     => 'decimal:2',
        'unit_price'   => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];
}

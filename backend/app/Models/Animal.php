<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'tag_id', 'breed', 'age_months', 'quantity',
        'status', 'purchase_price', 'current_value', 'notes',
    ];

    protected $casts = [
        'age_months'     => 'integer',
        'quantity'       => 'integer',
        'purchase_price' => 'decimal:2',
        'current_value'  => 'decimal:2',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaterProduction extends Model
{
    use HasFactory;

    protected $table = 'water_productions';

    protected $fillable = [
        'date', 'bags_produced', 'liters_used', 'cost', 'notes',
    ];

    protected $casts = [
        'date'          => 'date',
        'bags_produced' => 'integer',
        'liters_used'   => 'decimal:2',
        'cost'          => 'decimal:2',
    ];
}

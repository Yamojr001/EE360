<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class HatcheryRecord extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'sector_id',
        'date',
        'batch_number',
        'animal_type',
        'hatch_type',
        'external_provider',
        'external_contact',
        'cost',
        'eggs_set',
        'eggs_hatched',
        'mortality',
        'notes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'eggs_set' => 'integer',
        'eggs_hatched' => 'integer',
        'mortality' => 'integer',
    ];
}

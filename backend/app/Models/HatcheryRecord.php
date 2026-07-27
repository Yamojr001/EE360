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
        'eggs_set',
        'eggs_hatched',
        'mortality',
        'notes',
    ];
}

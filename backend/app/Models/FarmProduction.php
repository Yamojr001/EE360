<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\RecordsDeletedBy;
use App\Traits\LogsActivity;

class FarmProduction extends Model
{
    use HasFactory, SoftDeletes, RecordsDeletedBy, LogsActivity;

    protected $fillable = [
        'date',
        'category_id',
        'item_name',
        'quantity',
        'unit',
        'notes',
        'sector_id',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(AnimalCategory::class, 'category_id')->withTrashed();
    }
}

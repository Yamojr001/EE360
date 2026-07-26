<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\RecordsDeletedBy;

class WaterProduction extends Model
{
    use SoftDeletes, RecordsDeletedBy;

    use HasFactory;

    protected $table = 'water_productions';

    protected $fillable = [
        'date', 'bags_produced', 'liters_used', 'cost', 'notes', 'deleted_by'
    ];

    protected $casts = [
        'date'          => 'date',
        'bags_produced' => 'integer',
        'liters_used'   => 'decimal:2',
        'cost'          => 'decimal:2',
    ];

    protected static function booted()
    {
        static::addGlobalScope('admin_view_deleted', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $user = request()->user('sanctum') ?? auth()->user();
            if ($user && in_array($user->role, ['admin', 'super_admin'])) {
                $builder->withTrashed();
            }
        });
    }
}

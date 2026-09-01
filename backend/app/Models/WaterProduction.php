<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\RecordsDeletedBy;
use App\Traits\LogsActivity;

class WaterProduction extends Model
{
    use SoftDeletes, RecordsDeletedBy, LogsActivity;

    use HasFactory;

    protected $table = 'water_productions';

    protected $fillable = [
        'date', 'product_type', 'unit', 'bags_produced', 'bags_wasted', 'waste_reason', 'liters_used', 'cost', 'notes', 'deleted_by', 'sector_id'
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

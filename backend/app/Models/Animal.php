<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Animal extends Model
{
    use SoftDeletes, LogsActivity;

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

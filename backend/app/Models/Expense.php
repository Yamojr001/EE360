<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Expense extends Model
{
    use SoftDeletes, LogsActivity;

    use HasFactory;

    protected $fillable = [
        'date', 'category', 'description', 'amount', 'vendor', 'sector_id', 'notes',
    ];

    protected $casts = [
        'date'   => 'date',
        'amount' => 'decimal:2',
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

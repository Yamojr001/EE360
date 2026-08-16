<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $fillable = [
        'date', 'category', 'item', 'quantity', 'unit',
        'unit_price', 'total_amount', 'amount_paid', 'payment_status', 'buyer', 'notes',
    ];

    protected $casts = [
        'date'         => 'date',
        'quantity'     => 'decimal:2',
        'unit_price'   => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid'  => 'decimal:2',
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

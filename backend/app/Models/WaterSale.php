<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WaterSale extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $table = 'water_sales';

    protected $fillable = [
        'date', 'product_type', 'unit', 'quantity', 'unit_price', 'total_amount', 'amount_paid',
        'buyer', 'customer_id', 'distribution_area', 'payment_method', 'payment_status', 'sector_id'
    ];

    protected $casts = [
        'date'         => 'date',
        'quantity'     => 'integer',
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

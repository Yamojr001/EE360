<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class InventoryItem extends Model
{
    use SoftDeletes, LogsActivity;

    use HasFactory;

    protected $table = 'inventory_items';

    protected $fillable = [
        'name', 'category', 'quantity', 'unit', 'units_per_package',
        'unit_cost', 'min_stock_level', 'supplier', 'sector_id', 'notes',
    ];

    protected $casts = [
        'quantity'        => 'decimal:2',
        'unit_cost'       => 'decimal:2',
        'min_stock_level' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::addGlobalScope('admin_view_deleted', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $user = request()->user('sanctum') ?? auth()->user();
            if ($user && in_array($user->role, ['admin', 'super_admin'])) {
                $builder->withTrashed();
            }
        });

        static::created(function ($model) {
            \Illuminate\Support\Facades\DB::table('inventory_transactions')->insert([
                'inventory_item_id' => $model->id,
                'type' => 'in',
                'quantity' => $model->quantity,
                'description' => 'Initial Stock',
                'date' => now()->toDateString(),
                'user_id' => request()->user('sanctum')?->id ?? auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        static::updated(function ($model) {
            if ($model->isDirty('quantity')) {
                $old = $model->getOriginal('quantity');
                $new = $model->quantity;
                $diff = $new - $old;
                
                if ($diff != 0) {
                    \Illuminate\Support\Facades\DB::table('inventory_transactions')->insert([
                        'inventory_item_id' => $model->id,
                        'type' => $diff > 0 ? 'in' : 'out',
                        'quantity' => abs($diff),
                        'description' => 'Stock Update',
                        'date' => now()->toDateString(),
                        'user_id' => request()->user('sanctum')?->id ?? auth()->id(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Worker extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $fillable = [
        'staff_id', 'manager_id', 'sector_id', 'name', 'photo', 'role', 'phone', 'salary', 'hire_date',
        'status', 'address', 'notes',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary'    => 'decimal:2',
    ];

    protected static function booted()
    {
        static::addGlobalScope('admin_view_deleted', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $user = request()->user('sanctum') ?? auth()->user();
            if ($user && in_array($user->role, ['admin', 'super_admin'])) {
                $builder->withTrashed();
            }
        });

        static::creating(function ($model) {
            if (empty($model->staff_id)) {
                $year = date('y');
                $lastWorker = static::orderBy('id', 'desc')->first();
                $nextId = $lastWorker ? $lastWorker->id + 1 : 1;
                $model->staff_id = sprintf("EE360-%s-%04d", $year, $nextId);
            }
        });
    }
}

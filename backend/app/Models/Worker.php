<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Worker extends Model
{
    use SoftDeletes;
    use LogsActivity;
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
                $prefix = sprintf("EE360-%s-", $year);

                // Find highest existing staff_id with this prefix (including soft deleted rows!)
                $existingStaffIds = static::withoutGlobalScopes()
                    ->withTrashed()
                    ->where('staff_id', 'LIKE', "{$prefix}%")
                    ->pluck('staff_id');

                $maxSeq = 0;
                foreach ($existingStaffIds as $sid) {
                    if (preg_match('/(\d+)$/', $sid, $matches)) {
                        $num = (int) $matches[1];
                        if ($num > $maxSeq) {
                            $maxSeq = $num;
                        }
                    }
                }

                $nextSeq = $maxSeq + 1;
                // Double check uniqueness loop to guarantee no collision with existing or soft-deleted rows
                do {
                    $candidate = sprintf("%s%04d", $prefix, $nextSeq);
                    $exists = static::withoutGlobalScopes()
                        ->withTrashed()
                        ->where('staff_id', $candidate)
                        ->exists();
                    if ($exists) {
                        $nextSeq++;
                    }
                } while ($exists);

                $model->staff_id = $candidate;
            }
        });
    }
}

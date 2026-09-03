<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Incident extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'description',
        'category',
        'severity',
        'status',
        'image_path',
        'reported_date',
        'sector_id',
        'reported_by',
        'resolution_notes',
    ];

    protected $casts = [
        'reported_date' => 'date',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }
}

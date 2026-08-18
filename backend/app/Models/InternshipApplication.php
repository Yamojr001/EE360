<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternshipApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'institution',
        'course_of_study',
        'application_type',
        'duration_months',
        'start_date',
        'passport_photo',
        'document_path',
        'cover_letter',
        'status',
        'admin_notes',
    ];

    protected $appends = ['passport_url', 'document_url'];

    public function getPassportUrlAttribute()
    {
        return $this->passport_photo ? asset('storage/' . $this->passport_photo) : null;
    }

    public function getDocumentUrlAttribute()
    {
        return $this->document_path ? asset('storage/' . $this->document_path) : null;
    }
}

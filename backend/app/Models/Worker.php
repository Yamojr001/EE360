<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Worker extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'role', 'phone', 'salary', 'hire_date',
        'status', 'address', 'notes',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary'    => 'decimal:2',
    ];
}

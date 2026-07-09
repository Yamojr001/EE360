<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'category', 'description', 'amount', 'vendor', 'notes',
    ];

    protected $casts = [
        'date'   => 'date',
        'amount' => 'decimal:2',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\RecordsDeletedBy;
use App\Traits\LogsActivity;

class Customer extends Model
{
    use HasFactory, SoftDeletes, RecordsDeletedBy, LogsActivity;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'sector_id',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
    
    public function waterSales()
    {
        return $this->hasMany(WaterSale::class);
    }
}

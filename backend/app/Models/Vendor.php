<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Vendor extends Model
{
    use SoftDeletes, LogsActivity;
    protected $guarded = [];
}

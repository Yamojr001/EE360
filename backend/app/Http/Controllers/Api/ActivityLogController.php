<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        return ActivityLog::with('user:id,name,role')->orderByDesc('created_at')->limit(100)->get();
    }
}

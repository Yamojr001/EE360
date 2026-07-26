<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logAction($model, 'created');
        });

        static::updated(function ($model) {
            self::logAction($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logAction($model, 'deleted');
        });
    }

    protected static function logAction($model, $action)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $modelName = class_basename($model);
            
            $desc = "{$user->name} {$action} a {$modelName}";
            
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => $action,
                'description' => $desc,
                'model_type' => get_class($model),
                'model_id' => $model->id ?? null,
            ]);
        }
    }
}

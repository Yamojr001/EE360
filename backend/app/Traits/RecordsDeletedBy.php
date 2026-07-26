<?php

namespace App\Traits;

use App\Models\User;

trait RecordsDeletedBy
{
    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    protected static function bootRecordsDeletedBy()
    {
        static::deleting(function ($model) {
            $user = request()->user('sanctum') ?? auth()->user();
            if ($user && in_array('deleted_by', \Illuminate\Support\Facades\Schema::getColumnListing($model->getTable()))) {
                $model->deleted_by = $user->id;
                // If it's a soft delete, the deleted_at is updated and saved.
                // We should update the column so it gets saved with the delete query
                $model->saveQuietly();
            }
        });
    }
}

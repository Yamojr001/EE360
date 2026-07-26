<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AdminViewDeletedScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        if (auth()->check() && in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            $builder->withoutGlobalScope(SoftDeletingScope::class);
        }
    }
}

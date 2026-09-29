<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (!app()->runningInConsole() || app()->runningUnitTests()) {
                \App\Support\DatabaseSchemaEnsurer::ensureAll();
            }
        } catch (\Throwable $e) {
            // Fail silently if DB connection is unavailable during boot
        }
    }
}

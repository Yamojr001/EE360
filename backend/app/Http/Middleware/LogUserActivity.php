<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (Auth::check() && in_array($request->method(), ['POST', 'PUT', 'DELETE'])) {
            $user = Auth::user();
            $action = match ($request->method()) {
                'POST' => 'created',
                'PUT' => 'updated',
                'DELETE' => 'deleted',
                default => 'modified',
            };

            // Derive entity name from path
            $path = $request->path();
            $pathSegments = explode('/', $path);
            $entity = end($pathSegments);
            if (is_numeric($entity) && count($pathSegments) > 1) {
                $entity = $pathSegments[count($pathSegments) - 2];
            }
            
            $entity = ucfirst(str_replace('-', ' ', $entity));
            $description = "{$user->name} {$action} a record in {$entity}";

            // Skip logging login/logout inside standard api path if needed, but they are POST
            if (!str_contains($path, 'login') && !str_contains($path, 'logout')) {
                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => $action,
                    'description' => $description,
                ]);
            }
        }

        return $response;
    }
}

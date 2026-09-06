<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return response()->json([
        'name' => 'EE360 API',
        'status' => 'online',
        'version' => '1.0',
    ]);
});

// Direct storage file streaming fallback (ensures photos never 404 even if symlink is missing)
Route::get('/storage/{path}', function ($path) {
    if (str_contains($path, '..')) {
        abort(403);
    }

    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'File not found');
    }

    $fullPath = Storage::disk('public')->path($path);
    $mimeType = Storage::disk('public')->mimeType($path) ?: 'application/octet-stream';

    return Response::file($fullPath, [
        'Content-Type'                => $mimeType,
        'Cache-Control'               => 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin' => '*',
    ]);
})->where('path', '.*');

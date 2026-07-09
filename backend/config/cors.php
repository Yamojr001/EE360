<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    | This file controls how Cross-Origin Resource Sharing (CORS) headers
    | are set for responses from the EE360 API.
    |
    | Update 'allowed_origins' before deploying to your VPS!
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:5173',
        'http://localhost:3000',
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];

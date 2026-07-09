<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\WorkerController;
use App\Http\Controllers\Api\WaterProductionController;
use App\Http\Controllers\Api\WaterSaleController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| EE360 Farm API Routes
|--------------------------------------------------------------------------
*/

// Public auth routes
Route::post('/auth/login',  [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    // Livestock (CRUD)
    Route::apiResource('livestock', AnimalController::class);

    // Sales (CRUD)
    Route::apiResource('sales', SaleController::class);

    // Expenses (CRUD)
    Route::apiResource('expenses', ExpenseController::class);

    // Inventory (CRUD)
    Route::apiResource('inventory', InventoryController::class);

    // Workers (CRUD)
    Route::apiResource('workers', WorkerController::class);

    // Water Business
    Route::get('/water/production',      [WaterProductionController::class, 'index']);
    Route::post('/water/production',     [WaterProductionController::class, 'store']);
    Route::delete('/water/production/{id}', [WaterProductionController::class, 'destroy']);

    Route::get('/water/sales',           [WaterSaleController::class, 'index']);
    Route::post('/water/sales',          [WaterSaleController::class, 'store']);
    Route::delete('/water/sales/{id}',   [WaterSaleController::class, 'destroy']);

    // Reports
    Route::get('/reports/summary', [ReportController::class, 'summary']);
});

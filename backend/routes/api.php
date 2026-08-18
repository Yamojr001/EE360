<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\HatcheryRecordController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\WorkerController;
use App\Http\Controllers\Api\WaterProductionController;
use App\Http\Controllers\Api\WaterSaleController;
use App\Http\Controllers\Api\WaterExpenseController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\AnimalCategoryController;
use App\Http\Controllers\Api\FarmProductionController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\InternshipApplicationController;

/*
|--------------------------------------------------------------------------
| EE360 Farm API Routes
|--------------------------------------------------------------------------
*/

// Public auth & application routes
Route::post('/auth/login',  [AuthController::class, 'login']);
Route::get('/public/applications/settings', [InternshipApplicationController::class, 'getPublicSettings']);
Route::post('/public/applications', [InternshipApplicationController::class, 'submit']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/farm-summary', [DashboardController::class, 'farmSummary']);
    Route::get('/dashboard/water-summary', [DashboardController::class, 'waterSummary']);
    Route::get('/dashboard/super-summary', [DashboardController::class, 'superSummary']);

    // Livestock (CRUD)
    Route::apiResource('animal-categories', AnimalCategoryController::class);
    Route::apiResource('livestock', AnimalController::class);
    Route::apiResource('hatchery', HatcheryRecordController::class);

    // Sales (CRUD)
    Route::apiResource('sales', SaleController::class);

    // Expenses (CRUD)
    Route::apiResource('expenses', ExpenseController::class);

    // Ledger Route
    Route::get('/ledger', [App\Http\Controllers\Api\LedgerController::class, 'index']);

    // Inventory (CRUD)
    Route::apiResource('inventory', InventoryController::class);

    // Vendors (CRUD)
    Route::apiResource('vendors', VendorController::class);

    // Workers (CRUD)
    Route::apiResource('workers', WorkerController::class);

    // Water Business
    Route::get('/water/production',      [WaterProductionController::class, 'index']);
    Route::post('/water/production',     [WaterProductionController::class, 'store']);
    Route::delete('/water/production/{id}', [WaterProductionController::class, 'destroy']);

    Route::get('/animal-categories',       [AnimalCategoryController::class, 'index']);
    Route::post('/animal-categories',      [AnimalCategoryController::class, 'store']);
    Route::delete('/animal-categories/{id}', [AnimalCategoryController::class, 'destroy']);

    Route::get('/farm-production',       [FarmProductionController::class, 'index']);
    Route::post('/farm-production',      [FarmProductionController::class, 'store']);
    Route::put('/farm-production/{id}',  [FarmProductionController::class, 'update']);
    Route::delete('/farm-production/{id}', [FarmProductionController::class, 'destroy']);

    Route::get('/customers',       [CustomerController::class, 'index']);
    Route::post('/customers',      [CustomerController::class, 'store']);
    Route::put('/customers/{id}',  [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

    Route::get('/water/sales',           [WaterSaleController::class, 'index']);
    Route::post('/water/sales',          [WaterSaleController::class, 'store']);
    Route::delete('/water/sales/{id}',   [WaterSaleController::class, 'destroy']);

    Route::get('/water/expenses',        [WaterExpenseController::class, 'index']);
    Route::post('/water/expenses',       [WaterExpenseController::class, 'store']);
    Route::delete('/water/expenses/{id}', [WaterExpenseController::class, 'destroy']);

    // Reports & Logs
    Route::apiResource('incidents', IncidentController::class);
    Route::get('/reports/summary', [ReportController::class, 'summary']);
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Admin Applications Management
    Route::get('/applications', [InternshipApplicationController::class, 'index']);
    Route::put('/applications/{id}', [InternshipApplicationController::class, 'update']);
    Route::delete('/applications/{id}', [InternshipApplicationController::class, 'destroy']);
    Route::post('/applications/settings', [InternshipApplicationController::class, 'updateSettings']);
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WaterProduction;
use App\Models\WaterSale;
use App\Models\WaterExpense;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\Animal;
use Illuminate\Support\Facades\DB;

class LedgerController extends Controller
{
    public function index(Request $request)
    {
        $activities = collect();
        $user = $request->user();
        $role = $user ? $user->role : null;

        $sectorId = $request->query('sector_id');

        // Strictly enforce role boundaries at server level
        if ($role === 'water_manager') {
            $sectorId = 2;
        } elseif ($role === 'farm_manager') {
            $sectorId = 1;
        }

        $includeWater = !$sectorId || (int)$sectorId === 2;
        $includeFarm  = !$sectorId || (int)$sectorId === 1;

        // 1. Water Sector Records
        if ($includeWater) {
            WaterProduction::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'wp_'.$item->id,
                    'date' => $item->date ? (is_string($item->date) ? $item->date : $item->date->format('Y-m-d')) : now()->toDateString(),
                    'type' => 'Water Production',
                    'description' => "Produced {$item->bags_produced} bags",
                    'amount' => 0,
                    'sector' => 'water',
                    'is_income' => true,
                    'notes' => $item->notes ?? ''
                ]);
            });

            WaterSale::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'ws_'.$item->id,
                    'date' => $item->date,
                    'type' => 'Water Sale',
                    'description' => "Sold {$item->quantity} bags to " . ($item->buyer ?: 'Customer'),
                    'amount' => reset_number($item->total_amount),
                    'sector' => 'water',
                    'is_income' => true,
                    'notes' => ''
                ]);
            });

            WaterExpense::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'we_'.$item->id,
                    'date' => $item->date,
                    'type' => 'Water Expense',
                    'description' => $item->description,
                    'amount' => reset_number($item->amount),
                    'sector' => 'water',
                    'is_income' => false,
                    'notes' => $item->vendor ?? ''
                ]);
            });
        }

        // 2. Farm Sector Records
        if ($includeFarm) {
            Sale::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'fs_'.$item->id,
                    'date' => $item->date ? (is_string($item->date) ? $item->date : $item->date->format('Y-m-d')) : now()->toDateString(),
                    'type' => 'Farm Sale',
                    'description' => "Sold {$item->item} ({$item->quantity} {$item->unit}) to " . ($item->buyer ?: 'Customer'),
                    'amount' => reset_number($item->total_amount),
                    'sector' => 'farm',
                    'is_income' => true,
                    'notes' => $item->notes ?? ''
                ]);
            });

            Animal::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'an_'.$item->id,
                    'date' => $item->created_at ? $item->created_at->format('Y-m-d') : now()->toDateString(),
                    'type' => 'Livestock Entry',
                    'description' => "New Animal Logged ({$item->type})",
                    'amount' => 0,
                    'sector' => 'farm',
                    'is_income' => true,
                    'notes' => "Health: {$item->health_status}"
                ]);
            });

            Expense::get()->each(function($item) use (&$activities) {
                $activities->push([
                    'id' => 'fe_'.$item->id,
                    'date' => $item->date ? (is_string($item->date) ? $item->date : $item->date->format('Y-m-d')) : now()->toDateString(),
                    'type' => 'Farm Expense',
                    'description' => $item->description,
                    'amount' => reset_number($item->amount),
                    'sector' => 'farm',
                    'is_income' => false,
                    'notes' => $item->vendor ?? ''
                ]);
            });
        }

        // 3. Inventory Transactions
        $invQuery = DB::table('inventory_transactions')
          ->join('inventory_items', 'inventory_transactions.inventory_item_id', '=', 'inventory_items.id')
          ->select('inventory_transactions.*', 'inventory_items.name', 'inventory_items.category', 'inventory_items.unit', 'inventory_items.sector_id');

        if ($sectorId) {
            $invQuery->where('inventory_items.sector_id', $sectorId);
        }

        $invQuery->get()->each(function($tx) use (&$activities) {
            $activities->push([
                'id' => 'it_'.$tx->id,
                'date' => $tx->date,
                'type' => 'Inventory ' . ($tx->type === 'in' ? 'Added' : 'Used'),
                'description' => "{$tx->name}: " . ($tx->type === 'in' ? '+' : '-') . "{$tx->quantity} {$tx->unit}",
                'amount' => 0,
                'sector' => (int)$tx->sector_id === 2 ? 'water' : 'farm',
                'is_income' => $tx->type === 'in',
                'notes' => $tx->description ?? ''
            ]);
        });

        $sorted = $activities->sortByDesc('date')->values();

        // 4. Daily Stock Tracking Calculation for $targetDate
        $targetDate = $request->query('date');
        if (empty($targetDate)) {
            $targetDate = now()->toDateString();
        }

        // A. Water Daily Stock
        $priorProduced = (int) WaterProduction::whereDate('date', '<', $targetDate)->sum('bags_produced');
        $priorWasted   = (int) WaterProduction::whereDate('date', '<', $targetDate)->sum('bags_wasted');
        $priorNetProduced = $priorProduced - $priorWasted;
        $priorSold     = (int) WaterSale::whereDate('date', '<', $targetDate)->sum('quantity');
        $waterOpeningStock = $priorNetProduced - $priorSold;

        \App\Support\DatabaseSchemaEnsurer::ensureWaterSaleColumns();
        \App\Support\DatabaseSchemaEnsurer::ensureSaleColumns();
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');
        $hasFarmPaymentMethod  = \Illuminate\Support\Facades\Schema::hasColumn('sales', 'payment_method');

        $todayProduced = (int) WaterProduction::whereDate('date', $targetDate)->sum('bags_produced');
        $todayWasted   = (int) WaterProduction::whereDate('date', $targetDate)->sum('bags_wasted');
        $todayNetProduced = $todayProduced - $todayWasted;
        
        $todayWaterSalesQuery = WaterSale::whereDate('date', $targetDate);
        $todaySalesBags = (int) (clone $todayWaterSalesQuery)->sum('quantity');
        $todaySalesRevenue = (float) ($hasWaterPaymentMethod 
            ? (clone $todayWaterSalesQuery)->whereNotIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount')
            : (clone $todayWaterSalesQuery)->sum('total_amount'));
        $todayDrawingBags = $hasWaterPaymentMethod 
            ? (int) (clone $todayWaterSalesQuery)->whereIn('payment_method', ['Drawing', 'Draw'])->sum('quantity')
            : 0;
        $todayDrawingAmount = $hasWaterPaymentMethod 
            ? (float) (clone $todayWaterSalesQuery)->whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount')
            : 0;
        $todayProductionCost = (float) WaterProduction::whereDate('date', $targetDate)->sum('cost');

        $waterClosingStock = $waterOpeningStock + $todayNetProduced - $todaySalesBags;

        $dailyStock = [
            'date'                => $targetDate,
            'opening_stock'       => $waterOpeningStock,
            'total_production'    => $todayProduced,
            'total_wasted'        => $todayWasted,
            'net_production'      => $todayNetProduced,
            'total_sales'         => $todaySalesBags,
            'sales_revenue'       => $todaySalesRevenue,
            'drawing_bags'        => $todayDrawingBags,
            'drawing_amount'      => $todayDrawingAmount,
            'production_cost'     => $todayProductionCost,
            'closing_stock'       => $waterClosingStock,
            'net_change'          => $todayNetProduced - $todaySalesBags,
        ];

        // B. 7-Day History ending at targetDate
        $dailyHistory = [];
        try {
            $carbonTarget = \Carbon\Carbon::parse($targetDate);
        } catch (\Exception $e) {
            $carbonTarget = now();
        }

        for ($i = 6; $i >= 0; $i--) {
            $dStr = $carbonTarget->copy()->subDays($i)->toDateString();
            
            $dPriorProduced = (int) WaterProduction::whereDate('date', '<', $dStr)->sum('bags_produced');
            $dPriorWasted   = (int) WaterProduction::whereDate('date', '<', $dStr)->sum('bags_wasted');
            $dPriorSold     = (int) WaterSale::whereDate('date', '<', $dStr)->sum('quantity');
            $dOpening       = ($dPriorProduced - $dPriorWasted) - $dPriorSold;

            $dProduced      = (int) WaterProduction::whereDate('date', $dStr)->sum('bags_produced');
            $dWasted        = (int) WaterProduction::whereDate('date', $dStr)->sum('bags_wasted');
            $dNetProduced   = $dProduced - $dWasted;
            $dSold          = (int) WaterSale::whereDate('date', $dStr)->sum('quantity');
            
            $dRevQ          = WaterSale::whereDate('date', $dStr);
            if ($hasWaterPaymentMethod) {
                $dRevQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
            }
            $dRevenue       = (float) $dRevQ->sum('total_amount');
            $dClosing       = $dOpening + $dNetProduced - $dSold;

            $dailyHistory[] = [
                'date'             => $dStr,
                'opening_stock'    => $dOpening,
                'production_gross' => $dProduced,
                'production_waste' => $dWasted,
                'production_net'   => $dNetProduced,
                'sales_quantity'   => $dSold,
                'sales_revenue'    => $dRevenue,
                'closing_stock'    => $dClosing,
                'net_change'       => $dNetProduced - $dSold,
            ];
        }

        // C. Farm Daily Activity
        $farmSalesQ = Sale::whereDate('date', $targetDate);
        $farmRevenue = (float) ($hasFarmPaymentMethod 
            ? (clone $farmSalesQ)->whereNotIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount')
            : (clone $farmSalesQ)->sum('total_amount'));

        $farmDaily = [
            'date'           => $targetDate,
            'total_sales'    => (int) (clone $farmSalesQ)->sum('quantity'),
            'sales_revenue'  => $farmRevenue,
            'transactions'   => (int) (clone $farmSalesQ)->count(),
            'animals_added'  => (int) Animal::whereDate('created_at', $targetDate)->count(),
        ];

        return response()->json([
            'activities'   => $sorted,
            'dailyStock'   => $dailyStock,
            'farmDaily'    => $farmDaily,
            'dailyHistory' => $dailyHistory,
        ]);
    }
}

function reset_number($val) {
    return is_numeric($val) ? (float) $val : 0;
}

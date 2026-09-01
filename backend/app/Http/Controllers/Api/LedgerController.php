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
                    'date' => $item->date,
                    'type' => 'Farm Sale',
                    'description' => "Sold {$item->item_type} ({$item->quantity}) to " . ($item->buyer ?: 'Customer'),
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
                    'date' => $item->date,
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
        return response()->json($sorted);
    }
}

function reset_number($val) {
    return is_numeric($val) ? (float) $val : 0;
}

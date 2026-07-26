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

        // 1. Water Productions
        WaterProduction::all()->each(function($item) use (&$activities) {
            $activities->push([
                'id' => 'wp_'.$item->id,
                'date' => $item->date->format('Y-m-d'),
                'type' => 'Water Production',
                'description' => "Produced {$item->bags_produced} bags",
                'amount' => 0,
                'sector' => 'water',
                'is_income' => true,
                'notes' => $item->notes
            ]);
        });

        // 2. Water Sales
        WaterSale::all()->each(function($item) use (&$activities) {
            $activities->push([
                'id' => 'ws_'.$item->id,
                'date' => $item->date,
                'type' => 'Water Sale',
                'description' => "Sold {$item->quantity} bags to {$item->buyer}",
                'amount' => reset_number($item->total_amount),
                'sector' => 'water',
                'is_income' => true,
                'notes' => ''
            ]);
        });

        // 3. Farm Sales (Eggs, Animals)
        Sale::all()->each(function($item) use (&$activities) {
            $activities->push([
                'id' => 'fs_'.$item->id,
                'date' => $item->date,
                'type' => 'Farm Sale',
                'description' => "Sold {$item->item_type} ({$item->quantity}) to {$item->buyer}",
                'amount' => reset_number($item->total_amount),
                'sector' => 'farm',
                'is_income' => true,
                'notes' => $item->notes
            ]);
        });

        // 4. Animal Births / Deaths
        Animal::all()->each(function($item) use (&$activities) {
            $date = $item->created_at->format('Y-m-d');
            $status = $item->status; // active, sold, dead
            
            $activities->push([
                'id' => 'an_'.$item->id,
                'date' => $date,
                'type' => 'Livestock Entry',
                'description' => "New Animal Logged ({$item->type})",
                'amount' => 0,
                'sector' => 'farm',
                'is_income' => true,
                'notes' => "Health: {$item->health_status}"
            ]);
        });

        // 5. Farm Expenses
        Expense::all()->each(function($item) use (&$activities) {
            $activities->push([
                'id' => 'fe_'.$item->id,
                'date' => $item->date,
                'type' => 'Farm Expense',
                'description' => $item->description,
                'amount' => reset_number($item->amount),
                'sector' => 'farm',
                'is_income' => false,
                'notes' => $item->vendor
            ]);
        });

        // 6. Water Expenses
        WaterExpense::all()->each(function($item) use (&$activities) {
            $activities->push([
                'id' => 'we_'.$item->id,
                'date' => $item->date,
                'type' => 'Water Expense',
                'description' => $item->description,
                'amount' => reset_number($item->amount),
                'sector' => 'water',
                'is_income' => false,
                'notes' => $item->vendor
            ]);
        });

        // Inventory Transactions
        DB::table('inventory_transactions')
          ->join('inventory_items', 'inventory_transactions.inventory_item_id', '=', 'inventory_items.id')
          ->select('inventory_transactions.*', 'inventory_items.name', 'inventory_items.category', 'inventory_items.unit')
          ->get()
          ->each(function($tx) use (&$activities) {
              $activities->push([
                  'id' => 'it_'.$tx->id,
                  'date' => $tx->date,
                  'type' => 'Inventory ' . ($tx->type === 'in' ? 'Added' : 'Used'),
                  'description' => "{$tx->name}: " . ($tx->type === 'in' ? '+' : '-') . "{$tx->quantity} {$tx->unit}",
                  'amount' => 0,
                  'sector' => strtolower($tx->category),
                  'is_income' => $tx->type === 'in',
                  'notes' => $tx->description
              ]);
          });

        $sorted = $activities->sortByDesc('date')->values();
        
        return response()->json($sorted);
    }
}

function reset_number($val) {
    return is_numeric($val) ? (float) $val : 0;
}

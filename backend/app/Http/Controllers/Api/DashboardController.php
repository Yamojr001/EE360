<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\InventoryItem;
use App\Models\Worker;
use App\Models\WaterSale;
use App\Models\WaterExpense;
use App\Models\WaterProduction;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function summary()
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $monthSales    = Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
        $monthExpenses = Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
        $lastMonth     = $now->copy()->subMonth()->format('Y-m');
        $lastSales     = Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$lastMonth])->sum('total_amount');
        $lastExpenses  = Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$lastMonth])->sum('amount');

        $rev = $monthSales->sum('total_amount');
        $exp = $monthExpenses->sum('amount');

        $monthlyChart = [];
        for ($i = 11; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $monthlyChart[] = [
                'month'    => $mon,
                'revenue'  => Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount'),
                'expenses' => Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('amount'),
            ];
        }

        $salesByCategory = Sale::selectRaw('category, SUM(total_amount) as total')
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])
            ->groupBy('category')
            ->get();

        return response()->json([
            'totalAnimals'    => Animal::where('status', 'active')->sum('quantity'),
            'monthlyRevenue'  => $rev,
            'monthlyExpenses' => $exp,
            'netProfit'       => $rev - $exp,
            'revenueChange'   => $lastSales > 0 ? round((($rev - $lastSales) / $lastSales) * 100, 1) : 0,
            'expenseChange'   => $lastExpenses > 0 ? round((($exp - $lastExpenses) / $lastExpenses) * 100, 1) : 0,
            'totalSales'      => Sale::count(),
            'lowStockItems'   => InventoryItem::whereRaw('quantity <= min_stock_level')->count(),
            'totalWorkers'    => Worker::where('status', 'active')->count(),
            'recentSales'     => Sale::orderByDesc('date')->limit(5)->get(),
            'monthlyChart'    => $monthlyChart,
            'salesByCategory' => $salesByCategory,
        ]);
    }

    public function farmSummary()
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $monthSales    = Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
        $monthExpenses = Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);

        $rev = (float) $monthSales->sum('total_amount');
        $exp = (float) $monthExpenses->sum('amount');

        $monthlyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $monthlyChart[] = [
                'month'    => $mon,
                'revenue'  => (float) Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount'),
                'expenses' => (float) Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('amount'),
            ];
        }

        $salesByCategory = Sale::selectRaw('category, SUM(total_amount) as total')
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])
            ->groupBy('category')
            ->get();

        $animalByType = Animal::selectRaw('type, SUM(quantity) as count, SUM(quantity * current_value) as value')
            ->where('status', 'active')
            ->groupBy('type')
            ->get();

        return response()->json([
            'revenue'         => $rev,
            'expenses'        => $exp,
            'netProfit'       => $rev - $exp,
            'totalAnimals'    => Animal::where('status', 'active')->sum('quantity'),
            'lowStock'        => InventoryItem::whereRaw('quantity <= min_stock_level')->count(),
            'monthlyChart'    => $monthlyChart,
            'salesByCategory' => $salesByCategory,
            'animalByType'    => $animalByType,
            'recentSales'     => Sale::orderByDesc('date')->limit(5)->get(),
        ]);
    }

    public function waterSummary()
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $rev = (float) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total_amount');
        $exp = (float) WaterExpense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('amount');
        $prodCost = (float) WaterProduction::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('cost');

        $totalExp = $exp + $prodCost;

        $totalBagsProduced = (int) WaterProduction::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('bags_produced');
        $totalBagsSold = (int) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('quantity');

        $productionChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $productionChart[] = [
                'month'    => $mon,
                'produced' => (int) WaterProduction::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('bags_produced'),
                'sold'     => (int) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('quantity'),
            ];
        }

        $salesByArea = WaterSale::selectRaw('distribution_area as area, SUM(total_amount) as total')
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])
            ->whereNotNull('distribution_area')
            ->where('distribution_area', '!=', '')
            ->groupBy('distribution_area')
            ->get();

        $recentProduction = WaterProduction::orderByDesc('date')->limit(5)->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'date' => $p->date->format('Y-m-d'),
                'bags_produced' => $p->bags_produced,
                'liters_used' => $p->liters_used,
                'cost' => $p->cost,
                'notes' => $p->notes,
            ];
        });

        return response()->json([
            'revenue'           => $rev,
            'expenses'          => $totalExp,
            'netProfit'         => $rev - $totalExp,
            'totalBagsProduced' => $totalBagsProduced,
            'totalBagsSold'     => $totalBagsSold,
            'productionChart'   => $productionChart,
            'salesByArea'       => $salesByArea,
            'recentProduction'  => $recentProduction,
        ]);
    }

    public function superSummary(\Illuminate\Http\Request $request)
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $from = $request->query('from');
        $to = $request->query('to');

        if ($from && $to) {
            $farmRev = (float) Sale::whereBetween('date', [$from, $to])->sum('total_amount');
            $farmExp = (float) Expense::whereBetween('date', [$from, $to])->sum('amount');
            $waterRev = (float) WaterSale::whereBetween('date', [$from, $to])->sum('total_amount');
            $waterExp = (float) WaterExpense::whereBetween('date', [$from, $to])->sum('amount');
        } else {
            $farmRev = (float) Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total_amount');
            $farmExp = (float) Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('amount');
            $waterRev = (float) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total_amount');
            $waterExp = (float) WaterExpense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('amount');
        }

        $farmNet = $farmRev - $farmExp;
        $waterNet = $waterRev - $waterExp;

        $totalRev = $farmRev + $waterRev;
        $totalExp = $farmExp + $waterExp;
        $totalNet = $totalRev - $totalExp;

        $monthlyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $monthlyChart[] = [
                'month'         => $mon,
                'farm_revenue'  => (float) Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount'),
                'water_revenue' => (float) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount'),
            ];
        }

        $farmWorkers = Worker::where('status', 'active')->count(); // Assuming all workers are farm for now or need a sector column
        $waterWorkers = 0; // If you have a sector column, you'd filter by it

        $sectorBreakdown = [
            [
                'sector'   => 'Farm',
                'workers'  => $farmWorkers,
                'revenue'  => $farmRev,
                'expenses' => $farmExp,
                'net'      => $farmNet,
            ],
            [
                'sector'   => 'Water',
                'workers'  => $waterWorkers,
                'revenue'  => $waterRev,
                'expenses' => $waterExp,
                'net'      => $waterNet,
            ],
        ];

        // Combine recent activity from Farm and Water
        $recentFarmQuery = Sale::orderByDesc('date');
        $recentWaterQuery = WaterSale::orderByDesc('date');

        if ($from && $to) {
            $recentFarmQuery->whereBetween('date', [$from, $to]);
            $recentWaterQuery->whereBetween('date', [$from, $to]);
        }

        $recentFarm = $recentFarmQuery->limit(3)->get()->map(function ($s) {
            return [
                'desc'   => 'Sale: ' . $s->item,
                'sector' => 'Farm',
                'date'   => $s->date->format('Y-m-d'),
                'amount' => $s->total_amount,
            ];
        });

        $recentWater = $recentWaterQuery->limit(3)->get()->map(function ($s) {
            return [
                'desc'   => 'Water Sale to ' . $s->buyer,
                'sector' => 'Water',
                'date'   => $s->date->format('Y-m-d'),
                'amount' => $s->total_amount,
            ];
        });

        $recentActivity = collect($recentFarm)->merge($recentWater)->sortByDesc('date')->take(5)->values();

        return response()->json([
            'totalRevenue'    => $totalRev,
            'totalExpenses'   => $totalExp,
            'netProfit'       => $totalNet,
            'totalStaff'      => Worker::where('status', 'active')->count(),
            'sectorBreakdown' => $sectorBreakdown,
            'monthlyChart'    => $monthlyChart,
            'recentActivity'  => $recentActivity,
        ]);
    }
}

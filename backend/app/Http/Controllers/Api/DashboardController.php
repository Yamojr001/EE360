<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\InventoryItem;
use App\Models\Worker;
use App\Models\WaterSale;
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

    public function superSummary()
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $farmRev = (float) Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total_amount');
        $farmExp = (float) Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('amount');
        $farmNet = $farmRev - $farmExp;

        // Assuming WaterSale represents Water revenue and there are no specific Water expenses for now
        $waterRev = (float) WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total_amount');
        $waterExp = 0;
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
        $recentFarm = Sale::orderByDesc('date')->limit(3)->get()->map(function ($s) {
            return [
                'desc'   => 'Sale: ' . $s->item,
                'sector' => 'Farm',
                'date'   => $s->date->format('Y-m-d'),
                'amount' => $s->total_amount,
            ];
        });

        $recentWater = WaterSale::orderByDesc('date')->limit(3)->get()->map(function ($s) {
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

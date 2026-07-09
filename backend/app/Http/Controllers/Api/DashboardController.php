<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\InventoryItem;
use App\Models\Worker;
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

        // Monthly chart (last 12 months)
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
}

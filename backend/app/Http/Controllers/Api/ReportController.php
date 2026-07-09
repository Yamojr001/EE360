<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\Animal;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function summary()
    {
        $now = Carbon::now();

        // Monthly trend (last 12 months)
        $monthlyTrend = [];
        for ($i = 11; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $monthlyTrend[] = [
                'month'    => $mon,
                'revenue'  => Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount'),
                'expenses' => Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('amount'),
            ];
        }

        $revenueByCategory = Sale::selectRaw('category, SUM(total_amount) as total')
            ->groupBy('category')
            ->get();

        $expenseByCategory = Expense::selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get();

        $livestockByType = Animal::selectRaw('type, SUM(quantity * current_value) as value')
            ->where('status', 'active')
            ->groupBy('type')
            ->get();

        return response()->json([
            'totalRevenue'      => Sale::sum('total_amount'),
            'totalExpenses'     => Expense::sum('amount'),
            'monthlyTrend'      => $monthlyTrend,
            'revenueByCategory' => $revenueByCategory,
            'expenseByCategory' => $expenseByCategory,
            'livestockByType'   => $livestockByType,
        ]);
    }
}

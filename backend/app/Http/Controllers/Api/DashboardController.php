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
use App\Models\Customer;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function waterSummary(Request $request)
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $from = $request->query('from');
        $to   = $request->query('to');

        $prodQuery = WaterProduction::query();
        $saleQuery = WaterSale::query();
        $expQuery  = WaterExpense::query();

        if ($from && $to) {
            $prodQuery->whereBetween('date', [$from, $to]);
            $saleQuery->whereBetween('date', [$from, $to]);
            $expQuery->whereBetween('date', [$from, $to]);
        } elseif ($from) {
            $prodQuery->where('date', '>=', $from);
            $saleQuery->where('date', '>=', $from);
            $expQuery->where('date', '>=', $from);
        } elseif ($to) {
            $prodQuery->where('date', '<=', $to);
            $saleQuery->where('date', '<=', $to);
            $expQuery->where('date', '<=', $to);
        } else {
            $prodQuery->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $saleQuery->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $expQuery->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
        }

        // 1. Water Production in Selected Time
        $totalBagsProduced = (int) (clone $prodQuery)->sum('bags_produced');
        $totalBagsWasted   = (int) (clone $prodQuery)->sum('bags_wasted');
        $netBagsProduced   = max(0, $totalBagsProduced - $totalBagsWasted);
        $prodCost          = (float) (clone $prodQuery)->sum('cost');
        $totalLitersUsed   = (float) (clone $prodQuery)->sum('liters_used');

        \App\Support\DatabaseSchemaEnsurer::ensureWaterSaleColumns();
        \App\Support\DatabaseSchemaEnsurer::ensureWaterProductionColumns();
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');

        // 2. Commercial Sales (Excluding Drawings)
        $commercialSalesQ   = $hasWaterPaymentMethod ? (clone $saleQuery)->whereNotIn('payment_method', ['Drawing', 'Draw']) : clone $saleQuery;
        $totalBagsSold      = (int) (clone $commercialSalesQ)->sum('quantity');
        $waterSalesRevenue  = (float) (clone $commercialSalesQ)->sum('total_amount');
        $waterCashCollected = (float) (clone $commercialSalesQ)->sum('amount_paid');
        $avgPricePerBag     = $totalBagsSold > 0 ? round($waterSalesRevenue / $totalBagsSold, 2) : 0;

        // 3. Drawings (Owner / Internal Personal Withdrawals)
        $drawingSalesQ      = $hasWaterPaymentMethod ? (clone $saleQuery)->whereIn('payment_method', ['Drawing', 'Draw']) : null;
        $totalDrawingBags   = $drawingSalesQ ? (int) (clone $drawingSalesQ)->sum('quantity') : 0;
        $totalDrawingAmount = $drawingSalesQ ? (float) (clone $drawingSalesQ)->sum('total_amount') : 0;

        $allTimeDrawingAmount = $hasWaterPaymentMethod ? (float) WaterSale::whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount') : 0;
        $allTimeDrawingBags   = $hasWaterPaymentMethod ? (int) WaterSale::whereIn('payment_method', ['Drawing', 'Draw'])->sum('quantity') : 0;

        // 4. Factory Dispatches (Total bags leaving factory = Commercial Sold + Personal Drawings)
        $totalBagsDispatched    = $totalBagsSold + $totalDrawingBags;

        // 5. Water Production - Dispatched (Remaining Stock in factory warehouse)
        $productionMinusSold    = $totalBagsProduced - $totalBagsDispatched;
        $netProductionMinusSold = $netBagsProduced - $totalBagsDispatched;

        // 5. Debt / Receivables (Unpaid, Partial & Pending Sales)
        $periodDebt = (float) (clone $commercialSalesQ)
            ->where(function($q) {
                $q->where('payment_status', '!=', 'paid')
                  ->orWhereNull('payment_status');
            })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));

        $waterDebtBaseQ = WaterSale::query();
        if ($hasWaterPaymentMethod) {
            $waterDebtBaseQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
        }
        $waterDebtFiltered = (clone $waterDebtBaseQ)
            ->where(function($q) {
                $q->where('payment_status', '!=', 'paid')
                  ->orWhereNull('payment_status');
            })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0');

        $totalAccumulatedDebt = (float) (clone $waterDebtFiltered)->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));
        $totalDebtorsCount    = (int) (clone $waterDebtFiltered)->count();

        // 6. Expenses & Profit
        $exp       = (float) (clone $expQuery)->sum('amount');
        $totalExp  = $exp + $prodCost;
        $netProfit = $waterSalesRevenue - $totalExp;

        // Charts & Area Breakdown
        $productionChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            $soldQuery = WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m]);
            if ($hasWaterPaymentMethod) {
                $soldQuery->whereNotIn('payment_method', ['Drawing', 'Draw']);
            }
            $productionChart[] = [
                'month'    => $mon,
                'produced' => (int) WaterProduction::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('bags_produced'),
                'sold'     => (int) $soldQuery->sum('quantity'),
            ];
        }

        $salesByArea = (clone $commercialSalesQ)
            ->selectRaw('distribution_area as area, SUM(total_amount) as total')
            ->whereNotNull('distribution_area')
            ->where('distribution_area', '!=', '')
            ->groupBy('distribution_area')
            ->get();

        $recentProduction = (clone $prodQuery)->orderByDesc('date')->limit(5)->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'date' => $p->date ? (is_string($p->date) ? $p->date : $p->date->format('Y-m-d')) : '',
                'bags_produced' => $p->bags_produced,
                'bags_wasted' => $p->bags_wasted ?? 0,
                'price_per_bag' => (float) ($p->price_per_bag ?? 0),
                'liters_used' => $p->liters_used,
                'cost' => $p->cost,
                'notes' => $p->notes,
            ];
        });

        return response()->json([
            'revenue'                 => $waterSalesRevenue,
            'cashCollected'           => $waterCashCollected,
            'expenses'                => $totalExp,
            'operationalExpenses'     => $exp,
            'productionCost'          => $prodCost,
            'netProfit'               => $netProfit,
            'totalBagsProduced'       => $totalBagsProduced,
            'totalBagsWasted'         => $totalBagsWasted,
            'netBagsProduced'         => $netBagsProduced,
            'totalBagsSold'           => $totalBagsSold,
            'totalBagsDispatched'     => $totalBagsDispatched,
            'avgPricePerBag'          => $avgPricePerBag,
            'productionMinusSold'     => $productionMinusSold,
            'netProductionMinusSold'  => $netProductionMinusSold,
            'totalDebt'               => $periodDebt,
            'totalAccumulatedDebt'    => $totalAccumulatedDebt,
            'totalDebtorsCount'       => $totalDebtorsCount,
            'totalDrawingAmount'      => $totalDrawingAmount,
            'totalDrawingBags'        => $totalDrawingBags,
            'allTimeDrawingAmount'    => $allTimeDrawingAmount,
            'allTimeDrawingBags'      => $allTimeDrawingBags,
            'productionChart'         => $productionChart,
            'salesByArea'             => $salesByArea,
            'recentProduction'        => $recentProduction,
        ]);
    }

    public function superSummary(Request $request)
    {
        $now       = Carbon::now();
        $thisMonth = $now->format('Y-m');

        $from = $request->query('from');
        $to   = $request->query('to');

        $farmSaleQ  = Sale::query();
        $farmExpQ   = Expense::query();
        $waterSaleQ = WaterSale::query();
        $waterExpQ  = WaterExpense::query();
        $waterProdQ = WaterProduction::query();

        if ($from && $to) {
            $farmSaleQ->whereBetween('date', [$from, $to]);
            $farmExpQ->whereBetween('date', [$from, $to]);
            $waterSaleQ->whereBetween('date', [$from, $to]);
            $waterExpQ->whereBetween('date', [$from, $to]);
            $waterProdQ->whereBetween('date', [$from, $to]);
        } elseif ($from) {
            $farmSaleQ->where('date', '>=', $from);
            $farmExpQ->where('date', '>=', $from);
            $waterSaleQ->where('date', '>=', $from);
            $waterExpQ->where('date', '>=', $from);
            $waterProdQ->where('date', '>=', $from);
        } elseif ($to) {
            $farmSaleQ->where('date', '<=', $to);
            $farmExpQ->where('date', '<=', $to);
            $waterSaleQ->where('date', '<=', $to);
            $waterExpQ->where('date', '<=', $to);
            $waterProdQ->where('date', '<=', $to);
        } else {
            $farmSaleQ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $farmExpQ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $waterSaleQ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $waterExpQ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
            $waterProdQ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth]);
        }

        // Ensure all required database columns are present
        \App\Support\DatabaseSchemaEnsurer::ensureSaleColumns();
        \App\Support\DatabaseSchemaEnsurer::ensureWaterSaleColumns();
        \App\Support\DatabaseSchemaEnsurer::ensureWaterProductionColumns();

        $hasFarmPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('sales', 'payment_method');
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');

        // Farm commercial calculations (excluding drawings)
        $farmCommercialQ    = $hasFarmPaymentMethod ? (clone $farmSaleQ)->whereNotIn('payment_method', ['Drawing', 'Draw']) : clone $farmSaleQ;
        $farmRev            = (float) (clone $farmCommercialQ)->sum('total_amount');
        $farmCashCollected  = (float) (clone $farmCommercialQ)->sum('amount_paid');
        $farmExp            = (float) (clone $farmExpQ)->sum('amount');
        $farmNet            = $farmRev - $farmExp;

        // Water commercial calculations (excluding drawings)
        $waterCommercialQ   = $hasWaterPaymentMethod ? (clone $waterSaleQ)->whereNotIn('payment_method', ['Drawing', 'Draw']) : clone $waterSaleQ;
        $waterRev           = (float) (clone $waterCommercialQ)->sum('total_amount');
        $waterCashCollected = (float) (clone $waterCommercialQ)->sum('amount_paid');
        $waterExpOnly       = (float) (clone $waterExpQ)->sum('amount');
        $waterProdCost      = (float) (clone $waterProdQ)->sum('cost');
        $waterExp           = $waterExpOnly + $waterProdCost;
        $waterNet           = $waterRev - $waterExp;

        // Drawings
        $waterDrawingAmount   = $hasWaterPaymentMethod ? (float) (clone $waterSaleQ)->whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount') : 0;
        $waterDrawingBags     = $hasWaterPaymentMethod ? (int) (clone $waterSaleQ)->whereIn('payment_method', ['Drawing', 'Draw'])->sum('quantity') : 0;
        $farmDrawingAmount    = $hasFarmPaymentMethod ? (float) (clone $farmSaleQ)->whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount') : 0;
        $totalDrawingAmount   = $waterDrawingAmount + $farmDrawingAmount;

        $allTimeWaterDrawings = $hasWaterPaymentMethod ? (float) WaterSale::whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount') : 0;
        $allTimeFarmDrawings  = $hasFarmPaymentMethod ? (float) Sale::whereIn('payment_method', ['Drawing', 'Draw'])->sum('total_amount') : 0;
        $allTimeTotalDrawings = $allTimeWaterDrawings + $allTimeFarmDrawings;

        // Water Production - Dispatched (Sold + Drawings) in Selected Time
        $waterBagsProduced = (int) (clone $waterProdQ)->sum('bags_produced');
        $waterBagsWasted   = (int) (clone $waterProdQ)->sum('bags_wasted');
        $waterNetProduced  = max(0, $waterBagsProduced - $waterBagsWasted);
        $waterBagsSold     = (int) (clone $waterCommercialQ)->sum('quantity');
        $waterBagsDispatched = $waterBagsSold + $waterDrawingBags;
        $waterProductionMinusSold = $waterBagsProduced - $waterBagsDispatched;
        $waterNetProductionMinusSold = $waterNetProduced - $waterBagsDispatched;
        $waterAvgPricePerBag = $waterBagsSold > 0 ? round($waterRev / $waterBagsSold, 2) : 0;

        // Debt (Unpaid / partial)
        $waterDebt = (float) (clone $waterCommercialQ)
            ->where(function($q) { $q->where('payment_status', '!=', 'paid')->orWhereNull('payment_status'); })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));

        $allTimeWaterDebtQ = WaterSale::query();
        if ($hasWaterPaymentMethod) {
            $allTimeWaterDebtQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
        }
        $allTimeWaterDebt = (float) $allTimeWaterDebtQ
            ->where(function($q) { $q->where('payment_status', '!=', 'paid')->orWhereNull('payment_status'); })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));

        $farmDebt = (float) (clone $farmCommercialQ)
            ->where(function($q) { $q->where('payment_status', '!=', 'paid')->orWhereNull('payment_status'); })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));

        $allTimeFarmDebtQ = Sale::query();
        if ($hasFarmPaymentMethod) {
            $allTimeFarmDebtQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
        }
        $allTimeFarmDebt = (float) $allTimeFarmDebtQ
            ->where(function($q) { $q->where('payment_status', '!=', 'paid')->orWhereNull('payment_status'); })
            ->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->sum(DB::raw('total_amount - COALESCE(amount_paid, 0)'));

        $totalDebt            = $farmDebt + $waterDebt;
        $totalAccumulatedDebt = $allTimeFarmDebt + $allTimeWaterDebt;

        // Totals
        $totalRev = $farmRev + $waterRev;
        $totalExp = $farmExp + $waterExp;
        $totalNet = $totalRev - $totalExp;
        $totalCashCollected = $farmCashCollected + $waterCashCollected;

        $monthlyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');

            $fRevQ = Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m]);
            if ($hasFarmPaymentMethod) {
                $fRevQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
            }
            $wRevQ = WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m]);
            if ($hasWaterPaymentMethod) {
                $wRevQ->whereNotIn('payment_method', ['Drawing', 'Draw']);
            }

            $monthlyChart[] = [
                'month'         => $mon,
                'farm_revenue'  => (float) $fRevQ->sum('total_amount'),
                'water_revenue' => (float) $wRevQ->sum('total_amount'),
            ];
        }

        $farmWorkers  = Worker::where('status', 'active')->where(function($q) { $q->where('sector_id', 1)->orWhereNull('sector_id'); })->count();
        $waterWorkers = Worker::where('status', 'active')->where('sector_id', 2)->count();

        $sectorBreakdown = [
            [
                'sector'          => 'Farm',
                'workers'         => $farmWorkers,
                'revenue'         => $farmRev,
                'cash_collected'  => $farmCashCollected,
                'expenses'        => $farmExp,
                'net'             => $farmNet,
                'debt'            => $farmDebt,
                'drawings'        => $farmDrawingAmount,
            ],
            [
                'sector'          => 'Water',
                'workers'         => $waterWorkers,
                'revenue'         => $waterRev,
                'cash_collected'  => $waterCashCollected,
                'expenses'        => $waterExp,
                'net'             => $waterNet,
                'debt'            => $waterDebt,
                'drawings'        => $waterDrawingAmount,
                'bags_produced'   => $waterBagsProduced,
                'bags_sold'       => $waterBagsSold,
                'bags_drawn'      => $waterDrawingBags,
                'bags_dispatched' => $waterBagsDispatched,
                'net_balance'     => $waterProductionMinusSold,
                'avg_price'       => $waterAvgPricePerBag,
            ],
        ];

        // Combine recent activity
        $recentFarmQuery = Sale::orderByDesc('date');
        $recentWaterQuery = WaterSale::orderByDesc('date');

        if ($from && $to) {
            $recentFarmQuery->whereBetween('date', [$from, $to]);
            $recentWaterQuery->whereBetween('date', [$from, $to]);
        }

        $recentFarm = $recentFarmQuery->limit(3)->get()->map(function ($s) {
            return [
                'desc'   => 'Farm Sale: ' . ($s->item ?? 'Item') . ' (' . ($s->payment_method ?? 'Cash') . ')',
                'sector' => 'Farm',
                'date'   => $s->date ? (is_string($s->date) ? $s->date : $s->date->format('Y-m-d')) : '',
                'amount' => $s->total_amount,
            ];
        });

        $recentWater = $recentWaterQuery->limit(3)->get()->map(function ($s) {
            return [
                'desc'   => 'Water Sale to ' . ($s->buyer ?: 'Customer') . ' (' . ($s->payment_method ?? 'Cash') . ')',
                'sector' => 'Water',
                'date'   => $s->date ? (is_string($s->date) ? $s->date : $s->date->format('Y-m-d')) : '',
                'amount' => $s->total_amount,
            ];
        });

        $recentActivity = collect($recentFarm)->merge($recentWater)->sortByDesc('date')->take(5)->values();

        $topCustomers = Customer::withSum('sales', 'total_amount')
            ->withSum('waterSales', 'total_amount')
            ->get()
            ->map(function ($c) {
                $c->total_spent = ($c->sales_sum_total_amount ?? 0) + ($c->water_sales_sum_total_amount ?? 0);
                return $c;
            })
            ->sortByDesc('total_spent')
            ->take(5)
            ->values();

        return response()->json([
            'totalRevenue'                => $totalRev,
            'totalExpenses'               => $totalExp,
            'netProfit'                   => $totalNet,
            'combinedNet'                 => $totalNet,
            'totalCashCollected'          => $totalCashCollected,
            'totalStaff'                  => Worker::where('status', 'active')->count(),
            'totalDebt'                   => $totalDebt,
            'totalAccumulatedDebt'        => $totalAccumulatedDebt,
            'waterDebt'                   => $waterDebt,
            'farmDebt'                    => $farmDebt,
            'totalDrawingAmount'          => $totalDrawingAmount,
            'allTimeTotalDrawings'        => $allTimeTotalDrawings,
            'waterDrawingAmount'          => $waterDrawingAmount,
            'waterDrawingBags'            => $waterDrawingBags,
            'farmDrawingAmount'           => $farmDrawingAmount,
            'waterBagsProduced'           => $waterBagsProduced,
            'waterBagsWasted'             => $waterBagsWasted,
            'waterBagsSold'               => $waterBagsSold,
            'waterBagsDispatched'         => $waterBagsDispatched,
            'waterProductionMinusSold'    => $waterProductionMinusSold,
            'waterNetProductionMinusSold' => $waterNetProductionMinusSold,
            'waterAvgPricePerBag'         => $waterAvgPricePerBag,
            'waterRevenue'                => $waterRev,
            'waterCashCollected'          => $waterCashCollected,
            'farmRevenue'                 => $farmRev,
            'farmCashCollected'           => $farmCashCollected,
            'sectorBreakdown'             => $sectorBreakdown,
            'monthlyChart'                => $monthlyChart,
            'recentActivity'              => $recentActivity,
            'topCustomers'                => $topCustomers,
        ]);
    }
}

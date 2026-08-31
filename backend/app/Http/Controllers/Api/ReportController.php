<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\WaterSale;
use App\Models\WaterExpense;
use App\Models\Animal;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $now = Carbon::now();
        $sectorId = $request->query('sector_id');
        $from = $request->query('from');
        $to = $request->query('to');

        // Apply filters
        $dateFilter = function ($q) use ($from, $to) {
            if ($from) $q->whereDate('date', '>=', $from);
            if ($to) $q->whereDate('date', '<=', $to);
        };

        // Monthly trend (last 12 months)
        $monthlyTrend = [];
        for ($i = 11; $i >= 0; $i--) {
            $m   = $now->copy()->subMonths($i)->format('Y-m');
            $mon = $now->copy()->subMonths($i)->format('M');
            
            $rev = 0;
            $exp = 0;

            if (!$sectorId || $sectorId == 1) {
                $rev += Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount');
                $exp += Expense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('amount');
            }
            if (!$sectorId || $sectorId == 2) {
                $rev += WaterSale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('total_amount');
                $exp += WaterExpense::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$m])->sum('amount');
            }

            $monthlyTrend[] = [
                'month'    => $mon,
                'revenue'  => $rev,
                'expenses' => $exp,
            ];
        }

        // Query builders
        $salesQ = Sale::query();
        $waterSalesQ = WaterSale::query();
        $expQ = Expense::query();
        $waterExpQ = WaterExpense::query();
        $livestockQ = Animal::where('status', 'active');

        // Apply date filters
        $dateFilter($salesQ);
        $dateFilter($waterSalesQ);
        $dateFilter($expQ);
        $dateFilter($waterExpQ);

        // Calculate Revenue by Category
        $revenueByCategory = collect([]);
        if (!$sectorId || $sectorId == 1) {
            $farmRev = (clone $salesQ)->selectRaw('category, SUM(total_amount) as total')->groupBy('category')->get();
            $revenueByCategory = $revenueByCategory->concat($farmRev);
        }
        if (!$sectorId || $sectorId == 2) {
            $waterRevTotal = (clone $waterSalesQ)->sum('total_amount');
            if ($waterRevTotal > 0) {
                $revenueByCategory->push(['category' => 'water', 'total' => $waterRevTotal]);
            }
        }

        // Calculate Expense by Category
        $expenseByCategory = collect([]);
        if (!$sectorId || $sectorId == 1) {
            $farmExp = (clone $expQ)->selectRaw('category, SUM(amount) as total')->groupBy('category')->get();
            $expenseByCategory = $expenseByCategory->concat($farmExp);
        }
        if (!$sectorId || $sectorId == 2) {
            $waterExpTotal = (clone $waterExpQ)->sum('amount');
            if ($waterExpTotal > 0) {
                $expenseByCategory->push(['category' => 'water', 'total' => $waterExpTotal]);
            }
        }

        // Livestock value (only for farm or admin)
        $livestockByType = collect([]);
        if (!$sectorId || $sectorId == 1) {
            $livestockByType = $livestockQ->selectRaw('type, SUM(quantity * current_value) as value')->groupBy('type')->get();
        }

        $totalRevenue = 0;
        $totalExpenses = 0;
        if (!$sectorId || $sectorId == 1) {
            $totalRevenue += (clone $salesQ)->sum('total_amount');
            $totalExpenses += (clone $expQ)->sum('amount');
        }
        if (!$sectorId || $sectorId == 2) {
            $totalRevenue += (clone $waterSalesQ)->sum('total_amount');
            $totalExpenses += (clone $waterExpQ)->sum('amount');
        }

        // Build itemized system transactions list
        $transactions = collect();

        if (!$sectorId || $sectorId == 1) {
            (clone $salesQ)->orderBy('date', 'desc')->get()->each(function ($s) use (&$transactions) {
                $transactions->push([
                    'id'             => 'fs_' . $s->id,
                    'date'           => $s->date ? $s->date->format('Y-m-d') : null,
                    'sector'         => 'farm',
                    'type'           => 'Farm Sale',
                    'category'       => $s->category ?? 'Sales',
                    'description'    => "Sale: {$s->item} (" . (float)$s->quantity . " " . ($s->unit ?: 'units') . ") to " . ($s->buyer ?: 'Customer'),
                    'party'          => $s->buyer ?: 'Walk-in Customer',
                    'amount'         => (float)$s->total_amount,
                    'amount_paid'    => (float)($s->amount_paid ?? $s->total_amount),
                    'payment_status' => $s->payment_status ?: 'completed',
                    'payment_method' => $s->payment_method ?: 'cash',
                    'is_income'      => true,
                    'notes'          => $s->notes,
                ]);
            });

            (clone $expQ)->orderBy('date', 'desc')->get()->each(function ($e) use (&$transactions) {
                $transactions->push([
                    'id'             => 'fe_' . $e->id,
                    'date'           => $e->date ? $e->date->format('Y-m-d') : null,
                    'sector'         => 'farm',
                    'type'           => 'Farm Expense',
                    'category'       => $e->category ?? 'Expense',
                    'description'    => "Expense: {$e->description}" . ($e->vendor ? " (Vendor: {$e->vendor})" : ''),
                    'party'          => $e->vendor ?: 'N/A',
                    'amount'         => (float)$e->amount,
                    'amount_paid'    => (float)$e->amount,
                    'payment_status' => 'completed',
                    'payment_method' => 'cash',
                    'is_income'      => false,
                    'notes'          => $e->notes,
                ]);
            });
        }

        if (!$sectorId || $sectorId == 2) {
            (clone $waterSalesQ)->orderBy('date', 'desc')->get()->each(function ($ws) use (&$transactions) {
                $transactions->push([
                    'id'             => 'ws_' . $ws->id,
                    'date'           => $ws->date ? $ws->date->format('Y-m-d') : null,
                    'sector'         => 'water',
                    'type'           => 'Water Sale',
                    'category'       => 'Water Business',
                    'description'    => "Water Sale: " . ($ws->product_type ?: 'Sachet Water') . " (" . (int)$ws->quantity . " " . ($ws->unit ?: 'bags') . ") to " . ($ws->buyer ?: 'Customer'),
                    'party'          => $ws->buyer ?: 'Walk-in Customer',
                    'amount'         => (float)$ws->total_amount,
                    'amount_paid'    => (float)($ws->amount_paid ?? $ws->total_amount),
                    'payment_status' => $ws->payment_status ?: 'completed',
                    'payment_method' => $ws->payment_method ?: 'cash',
                    'is_income'      => true,
                    'notes'          => $ws->distribution_area ? "Area: {$ws->distribution_area}" : null,
                ]);
            });

            (clone $waterExpQ)->orderBy('date', 'desc')->get()->each(function ($we) use (&$transactions) {
                $transactions->push([
                    'id'             => 'we_' . $we->id,
                    'date'           => $we->date ? $we->date->format('Y-m-d') : null,
                    'sector'         => 'water',
                    'type'           => 'Water Expense',
                    'category'       => $we->category ?? 'Water Operations',
                    'description'    => "Water Expense: {$we->description}" . ($we->vendor ? " (Vendor: {$we->vendor})" : ''),
                    'party'          => $we->vendor ?: 'N/A',
                    'amount'         => (float)$we->amount,
                    'amount_paid'    => (float)$we->amount,
                    'payment_status' => 'completed',
                    'payment_method' => 'cash',
                    'is_income'      => false,
                    'notes'          => $we->notes,
                ]);
            });
        }

        $sortedTransactions = $transactions->sortByDesc('date')->values();

        return response()->json([
            'totalRevenue'      => $totalRevenue,
            'totalExpenses'     => $totalExpenses,
            'monthlyTrend'      => $monthlyTrend,
            'revenueByCategory' => $revenueByCategory,
            'expenseByCategory' => $expenseByCategory,
            'livestockByType'   => $livestockByType,
            'transactions'      => $sortedTransactions,
        ]);
    }
}

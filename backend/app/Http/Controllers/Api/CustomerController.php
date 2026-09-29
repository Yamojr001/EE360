<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\WaterSale;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();
        $sectorId = $request->query('sector_id');

        if ($sectorId !== null && $sectorId !== '') {
            $query->where(function($q) use ($sectorId) {
                $q->where('sector_id', $sectorId)
                  ->orWhereNull('sector_id')
                  ->orWhereHas('waterSales');
            });
        }

        $customers = $query->orderBy('name')->get();

        $hasSalePaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('sales', 'payment_method');
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');

        $result = $customers->map(function ($c) use ($hasSalePaymentMethod, $hasWaterPaymentMethod) {
            // Match Farm sales
            $farmSalesQ = Sale::where(function($q) use ($c) {
                $q->where('customer_id', $c->id)
                  ->orWhere(function($sub) use ($c) {
                      $sub->whereNull('customer_id')
                          ->whereRaw('LOWER(buyer) = ?', [strtolower($c->name)]);
                  });
            });

            // Match Water sales
            $waterSalesQ = WaterSale::where(function($q) use ($c) {
                $q->where('customer_id', $c->id)
                  ->orWhere(function($sub) use ($c) {
                      $sub->whereNull('customer_id')
                          ->whereRaw('LOWER(buyer) = ?', [strtolower($c->name)]);
                  });
            });

            if ($hasSalePaymentMethod) {
                $farmCommercial = (clone $farmSalesQ)->whereNotIn('payment_method', ['Drawing', 'Draw']);
                $farmDrawings   = (clone $farmSalesQ)->whereIn('payment_method', ['Drawing', 'Draw']);
            } else {
                $farmCommercial = clone $farmSalesQ;
                $farmDrawings   = (clone $farmSalesQ)->whereRaw('1 = 0');
            }

            if ($hasWaterPaymentMethod) {
                $waterCommercial = (clone $waterSalesQ)->whereNotIn('payment_method', ['Drawing', 'Draw']);
                $waterDrawings   = (clone $waterSalesQ)->whereIn('payment_method', ['Drawing', 'Draw']);
            } else {
                $waterCommercial = clone $waterSalesQ;
                $waterDrawings   = (clone $waterSalesQ)->whereRaw('1 = 0');
            }

            $farmPurchases   = (float) (clone $farmCommercial)->sum('total_amount');
            $farmPaid        = (float) (clone $farmCommercial)->sum('amount_paid');
            $farmDrawingsAmt = (float) (clone $farmDrawings)->sum('total_amount');

            $waterPurchases   = (float) (clone $waterCommercial)->sum('total_amount');
            $waterPaid        = (float) (clone $waterCommercial)->sum('amount_paid');
            $waterDrawingsAmt = (float) (clone $waterDrawings)->sum('total_amount');
            $waterDrawingBags = (int) (clone $waterDrawings)->sum('quantity');

            $totalPurchases = round($farmPurchases + $waterPurchases, 2);
            $totalPaid      = round($farmPaid + $waterPaid, 2);
            $totalDrawings  = round($farmDrawingsAmt + $waterDrawingsAmt, 2);

            // Commercial Debt: (Purchases - Paid)
            // If > 0: customer owes money (debtor)
            // If < 0: customer has overpaid (deposit/credit)
            $commercialDebt = round($totalPurchases - $totalPaid, 2);

            // Net Balance: includes both unpaid purchases (+ debt) AND drawings taken (+ drawings)
            $netBalance = round(($totalPurchases - $totalPaid) + $totalDrawings, 2);

            $pendingSalesCount = (clone $farmCommercial)->where('payment_status', 'pending')->count()
                               + (clone $waterCommercial)->where('payment_status', 'pending')->count();
            $partialSalesCount = (clone $farmCommercial)->where('payment_status', 'partial')->count()
                               + (clone $waterCommercial)->where('payment_status', 'partial')->count();

            return [
                'id'                  => $c->id,
                'name'                => $c->name,
                'phone'               => $c->phone,
                'address'             => $c->address,
                'sector_id'           => $c->sector_id,
                'total_purchases'     => $totalPurchases,
                'total_paid'          => $totalPaid,
                'commercial_debt'     => $commercialDebt,
                'total_drawings'      => $totalDrawings,
                'water_drawing_bags'  => $waterDrawingBags,
                'balance'             => $netBalance, // Remaining balance (+ or -)
                'pending_count'       => $pendingSalesCount,
                'partial_count'       => $partialSalesCount,
                'farm_purchases'      => round($farmPurchases, 2),
                'water_purchases'     => round($waterPurchases, 2),
                'created_at'          => $c->created_at,
            ];
        });

        return response()->json($result);
    }

    public function show($id)
    {
        $c = Customer::findOrFail($id);

        // Fetch all farm sales
        $farmSales = Sale::where(function($q) use ($c) {
                $q->where('customer_id', $c->id)
                  ->orWhere(function($sub) use ($c) {
                      $sub->whereNull('customer_id')
                          ->whereRaw('LOWER(buyer) = ?', [strtolower($c->name)]);
                  });
            })
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get()
            ->map(function($s) {
                $s->sector_label = 'Farm';
                return $s;
            });

        // Fetch all water sales
        $waterSales = WaterSale::where(function($q) use ($c) {
                $q->where('customer_id', $c->id)
                  ->orWhere(function($sub) use ($c) {
                      $sub->whereNull('customer_id')
                          ->whereRaw('LOWER(buyer) = ?', [strtolower($c->name)]);
                  });
            })
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get()
            ->map(function($ws) {
                $ws->sector_label = 'Water';
                return $ws;
            });

        $allTransactions = collect($farmSales)->merge($waterSales)->sortByDesc('date')->values();

        $hasSalePaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('sales', 'payment_method');
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');

        $farmPurchases = (float) ($hasSalePaymentMethod ? $farmSales->whereNotIn('payment_method', ['Drawing', 'Draw']) : $farmSales)->sum('total_amount');
        $farmPaid      = (float) ($hasSalePaymentMethod ? $farmSales->whereNotIn('payment_method', ['Drawing', 'Draw']) : $farmSales)->sum('amount_paid');
        $farmDrawings  = (float) ($hasSalePaymentMethod ? $farmSales->whereIn('payment_method', ['Drawing', 'Draw']) : collect())->sum('total_amount');

        $waterPurchases = (float) ($hasWaterPaymentMethod ? $waterSales->whereNotIn('payment_method', ['Drawing', 'Draw']) : $waterSales)->sum('total_amount');
        $waterPaid      = (float) ($hasWaterPaymentMethod ? $waterSales->whereNotIn('payment_method', ['Drawing', 'Draw']) : $waterSales)->sum('amount_paid');
        $waterDrawings  = (float) ($hasWaterPaymentMethod ? $waterSales->whereIn('payment_method', ['Drawing', 'Draw']) : collect())->sum('total_amount');
        $waterDrawingBags = (int) ($hasWaterPaymentMethod ? $waterSales->whereIn('payment_method', ['Drawing', 'Draw']) : collect())->sum('quantity');

        $totalPurchases = round($farmPurchases + $waterPurchases, 2);
        $totalPaid      = round($farmPaid + $waterPaid, 2);
        $totalDrawings  = round($farmDrawings + $waterDrawings, 2);
        $balance        = round(($totalPurchases - $totalPaid) + $totalDrawings, 2);

        return response()->json([
            'customer'        => $c,
            'summary'         => [
                'total_purchases'    => $totalPurchases,
                'total_paid'         => $totalPaid,
                'total_drawings'     => $totalDrawings,
                'water_drawing_bags' => $waterDrawingBags,
                'balance'            => $balance,
                'commercial_debt'    => round($totalPurchases - $totalPaid, 2),
            ],
            'transactions'    => $allTransactions,
        ]);
    }

    public function recordPayment(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
        $data = $request->validate([
            'amount'         => 'required|numeric|min:0.01',
            'payment_method' => 'nullable|string',
        ]);

        $remainingPayment = (float) $data['amount'];
        $method = $data['payment_method'] ?? 'Cash';
        $hasSalePaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('sales', 'payment_method');
        $hasWaterPaymentMethod = \Illuminate\Support\Facades\Schema::hasColumn('water_sales', 'payment_method');

        // 1. Pay oldest unpaid water sales
        $waterQuery = WaterSale::where(function($q) use ($customer) {
                $q->where('customer_id', $customer->id)
                  ->orWhere(function($sub) use ($customer) {
                      $sub->whereNull('customer_id')
                          ->whereRaw('LOWER(buyer) = ?', [strtolower($customer->name)]);
                  });
            });
        if ($hasWaterPaymentMethod) {
            $waterQuery->whereNotIn('payment_method', ['Drawing', 'Draw']);
        }
        $unpaidWaterSales = $waterQuery->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
            ->orderBy('date')
            ->get();

        foreach ($unpaidWaterSales as $ws) {
            if ($remainingPayment <= 0) break;
            $due = (float)$ws->total_amount - (float)$ws->amount_paid;
            $pay = min($due, $remainingPayment);
            $newPaid = (float)$ws->amount_paid + $pay;
            $ws->amount_paid = $newPaid;
            $ws->payment_status = ($newPaid >= (float)$ws->total_amount) ? 'paid' : 'partial';
            if ($hasWaterPaymentMethod) {
                $ws->payment_method = $method;
            }
            $ws->save();
            $remainingPayment -= $pay;
        }

        // 2. Pay oldest unpaid farm sales
        if ($remainingPayment > 0) {
            $farmQuery = Sale::where(function($q) use ($customer) {
                    $q->where('customer_id', $customer->id)
                      ->orWhere(function($sub) use ($customer) {
                          $sub->whereNull('customer_id')
                              ->whereRaw('LOWER(buyer) = ?', [strtolower($customer->name)]);
                      });
                });
            if ($hasSalePaymentMethod) {
                $farmQuery->whereNotIn('payment_method', ['Drawing', 'Draw']);
            }
            $unpaidFarmSales = $farmQuery->whereRaw('(total_amount - COALESCE(amount_paid, 0)) > 0')
                ->orderBy('date')
                ->get();

            foreach ($unpaidFarmSales as $s) {
                if ($remainingPayment <= 0) break;
                $due = (float)$s->total_amount - (float)$s->amount_paid;
                $pay = min($due, $remainingPayment);
                $newPaid = (float)$s->amount_paid + $pay;
                $s->amount_paid = $newPaid;
                $s->payment_status = ($newPaid >= (float)$s->total_amount) ? 'paid' : 'partial';
                if ($hasSalePaymentMethod) {
                    $s->payment_method = $method;
                }
                $s->save();
                $remainingPayment -= $pay;
            }
        }

        return response()->json([
            'message' => 'Payment recorded successfully',
            'unallocated_credit' => round($remainingPayment, 2),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'phone'     => 'nullable|string|max:50',
            'address'   => 'nullable|string|max:255',
            'sector_id' => 'nullable|integer',
        ]);

        return response()->json(Customer::create($data), 201);
    }
    
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'phone'     => 'nullable|string|max:50',
            'address'   => 'nullable|string|max:255',
            'sector_id' => 'nullable|integer',
        ]);
        $customer->update($data);
        return response()->json($customer);
    }

    public function destroy($id)
    {
        Customer::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

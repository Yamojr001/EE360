<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Customer;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::query();
        $user = $request->user();
        
        $sectorId = $request->query('sector_id');
        if ($user && $user->role === 'farm_manager') {
            $sectorId = 1;
        } elseif ($user && $user->role === 'water_manager') {
            $sectorId = 2;
        }

        if ($sectorId !== null && $sectorId !== '') {
            if ((int)$sectorId === 1) {
                $query->where(function($q) {
                    $q->where('sector_id', 1)->orWhereNull('sector_id');
                });
            } else {
                $query->where('sector_id', $sectorId);
            }
        }

        return $query->orderByDesc('date')->orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'           => 'required|date',
            'category'       => 'required|string',
            'item'           => 'required|string|max:200',
            'quantity'       => 'nullable|numeric|min:0',
            'unit'           => 'nullable|string|max:30',
            'unit_price'     => 'nullable|numeric|min:0',
            'total_amount'   => 'required|numeric|min:0',
            'amount_paid'    => 'nullable|numeric|min:0',
            'buyer'          => 'nullable|string|max:100',
            'customer_id'    => 'nullable|integer',
            'notes'          => 'nullable|string',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'sector_id'      => 'nullable|integer',
        ]);

        $data['quantity'] = isset($data['quantity']) && $data['quantity'] !== '' ? (float)$data['quantity'] : 1;
        $data['unit_price'] = isset($data['unit_price']) && $data['unit_price'] !== '' ? (float)$data['unit_price'] : 0;

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        $method = strtolower($data['payment_method'] ?? '');
        if ($method === 'drawing' || $method === 'draw') {
            $data['payment_status'] = 'paid';
            $data['amount_paid'] = 0;
            if (empty($data['buyer'])) {
                $data['buyer'] = 'Owner / Director Drawing';
            }
        } elseif ($method === 'pending' || str_contains($method, 'pending')) {
            $data['payment_status'] = 'pending';
            $data['amount_paid'] = isset($data['amount_paid']) ? (float)$data['amount_paid'] : 0;
            if (empty($data['buyer'])) {
                $data['buyer'] = 'Pending Customer';
            }
        } else {
            $paid = isset($data['amount_paid']) ? (float)$data['amount_paid'] : (float)$data['total_amount'];
            $data['amount_paid'] = $paid;
            if ($paid >= (float)$data['total_amount']) {
                $data['payment_status'] = 'paid';
            } elseif ($paid > 0) {
                $data['payment_status'] = 'partial';
            } else {
                $data['payment_status'] = 'pending';
            }
        }

        // Auto-save or link Customer in customers table
        if (!empty($data['buyer'])) {
            try {
                $buyerName = trim($data['buyer']);
                $customer = null;
                if (!empty($data['customer_id'])) {
                    $customer = Customer::find($data['customer_id']);
                }
                if (!$customer) {
                    $customer = Customer::whereRaw('LOWER(name) = ?', [strtolower($buyerName)])->first();
                }
                if (!$customer) {
                    $customer = Customer::create([
                        'name'      => $buyerName,
                        'sector_id' => $data['sector_id'] ?? 1,
                    ]);
                }
                if ($customer) {
                    $data['customer_id'] = $customer->id;
                    $data['buyer']       = $customer->name;
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Customer auto-link failed: ' . $e->getMessage());
            }
        }

        \App\Support\DatabaseSchemaEnsurer::ensureSaleColumns();
        $insertData = \App\Support\DatabaseSchemaEnsurer::filterData('sales', $data);

        return response()->json(Sale::create($insertData), 201);
    }

    public function update(Request $request, $sale)
    {
        $sale = $sale instanceof Sale ? $sale : Sale::findOrFail($sale);

        $data = $request->validate([
            'amount_paid'    => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
        ]);

        $amount_paid = (float) $data['amount_paid'];
        $total = (float) $sale->total_amount;

        if (!empty($data['payment_status'])) {
            $status = $data['payment_status'];
        } elseif ($amount_paid >= $total) {
            $status = 'paid';
        } elseif ($amount_paid > 0) {
            $status = 'partial';
        } else {
            $status = 'pending';
        }

        $updateData = [
            'amount_paid'    => $amount_paid,
            'payment_status' => $status,
        ];

        if (!empty($data['payment_method'])) {
            $updateData['payment_method'] = $data['payment_method'];
        }

        \App\Support\DatabaseSchemaEnsurer::ensureSaleColumns();
        $filteredUpdate = \App\Support\DatabaseSchemaEnsurer::filterData('sales', $updateData);

        $sale->update($filteredUpdate);

        return response()->json($sale);
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

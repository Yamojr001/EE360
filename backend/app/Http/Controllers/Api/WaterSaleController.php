<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterSale;
use App\Models\Customer;
use Illuminate\Http\Request;

class WaterSaleController extends Controller
{
    public function index(Request $request)
    {
        $query = WaterSale::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'              => 'required|date',
            'product_type'      => 'nullable|string|max:50',
            'unit'              => 'nullable|string|max:50',
            'quantity'          => 'required|integer|min:0',
            'unit_price'        => 'required|numeric|min:0',
            'total_amount'      => 'required|numeric|min:0',
            'amount_paid'       => 'nullable|numeric|min:0',
            'buyer'             => 'nullable|string|max:100',
            'customer_id'       => 'nullable|integer',
            'distribution_area' => 'nullable|string|max:100',
            'payment_method'    => 'nullable|string',
            'payment_status'    => 'nullable|string',
            'sector_id'         => 'nullable|integer',
        ]);

        if (empty($data['sector_id'])) {
            $data['sector_id'] = 2;
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
                    \App\Support\DatabaseSchemaEnsurer::ensureCustomerColumns();
                    $customerData = [
                        'name'      => $buyerName,
                        'sector_id' => $data['sector_id'] ?? 2,
                        'address'   => $data['distribution_area'] ?? null,
                    ];
                    $filteredCustomerData = \App\Support\DatabaseSchemaEnsurer::filterData('customers', $customerData);
                    $customer = Customer::create($filteredCustomerData);
                }
                if ($customer) {
                    $data['customer_id'] = $customer->id;
                    $data['buyer']       = $customer->name;
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('WaterSale customer auto-link failed: ' . $e->getMessage());
            }
        }

        \App\Support\DatabaseSchemaEnsurer::ensureWaterSaleColumns();
        $insertData = \App\Support\DatabaseSchemaEnsurer::filterData('water_sales', $data);

        return response()->json(WaterSale::create($insertData), 201);
    }

    public function update(Request $request, $id)
    {
        $waterSale = WaterSale::findOrFail($id);

        $data = $request->validate([
            'amount_paid'    => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
        ]);

        $amount_paid = (float) $data['amount_paid'];
        $total = (float) $waterSale->total_amount;

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

        \App\Support\DatabaseSchemaEnsurer::ensureWaterSaleColumns();
        $filteredUpdate = \App\Support\DatabaseSchemaEnsurer::filterData('water_sales', $updateData);

        $waterSale->update($filteredUpdate);

        return response()->json($waterSale);
    }

    public function destroy($id)
    {
        WaterSale::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

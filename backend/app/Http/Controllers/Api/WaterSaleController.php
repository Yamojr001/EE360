<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterSale;
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

        if (isset($data['amount_paid'])) {
            $data['payment_status'] = $data['amount_paid'] >= $data['total_amount'] ? 'paid' : 'partial';
        }

        return response()->json(WaterSale::create($data), 201);
    }

    public function update(Request $request, WaterSale $waterSale)
    {
        $data = $request->validate([
            'amount_paid'  => 'required|numeric|min:0',
            'payment_status' => 'nullable|string',
        ]);

        $amount_paid = $data['amount_paid'];
        $status = $amount_paid >= $waterSale->total_amount ? 'paid' : 'partial';

        $waterSale->update([
            'amount_paid' => $amount_paid,
            'payment_status' => $status
        ]);

        return response()->json($waterSale);
    }

    public function destroy($id)
    {
        WaterSale::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

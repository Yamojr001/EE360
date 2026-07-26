<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'         => 'required|date',
            'category'     => 'required|string',
            'item'         => 'required|string|max:200',
            'quantity'     => 'numeric|min:0',
            'unit'         => 'nullable|string|max:30',
            'unit_price'   => 'numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'buyer'        => 'nullable|string|max:100',
            'customer_id'  => 'nullable|integer',
            'notes'        => 'nullable|string',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'sector_id'    => 'nullable|integer',
        ]);

        return response()->json(Sale::create($data), 201);
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

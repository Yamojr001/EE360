<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        return Sale::orderByDesc('date')->get();
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
            'notes'        => 'nullable|string',
        ]);

        return response()->json(Sale::create($data), 201);
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

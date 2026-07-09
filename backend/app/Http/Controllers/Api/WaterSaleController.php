<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterSale;
use Illuminate\Http\Request;

class WaterSaleController extends Controller
{
    public function index()
    {
        return WaterSale::orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'              => 'required|date',
            'quantity'          => 'required|integer|min:0',
            'unit_price'        => 'required|numeric|min:0',
            'total_amount'      => 'required|numeric|min:0',
            'buyer'             => 'nullable|string|max:100',
            'distribution_area' => 'nullable|string|max:100',
        ]);

        return response()->json(WaterSale::create($data), 201);
    }

    public function destroy($id)
    {
        WaterSale::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

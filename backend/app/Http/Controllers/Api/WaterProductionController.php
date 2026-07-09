<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterProduction;
use Illuminate\Http\Request;

class WaterProductionController extends Controller
{
    public function index()
    {
        return WaterProduction::orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'          => 'required|date',
            'bags_produced' => 'required|integer|min:0',
            'liters_used'   => 'numeric|min:0',
            'cost'          => 'numeric|min:0',
            'notes'         => 'nullable|string',
        ]);

        return response()->json(WaterProduction::create($data), 201);
    }

    public function destroy($id)
    {
        WaterProduction::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

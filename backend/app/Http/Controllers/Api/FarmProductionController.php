<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmProduction;
use Illuminate\Http\Request;

class FarmProductionController extends Controller
{
    public function index(Request $request)
    {
        $query = FarmProduction::with(['category', 'deleter']);
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'        => 'required|date',
            'category_id' => 'nullable|integer|exists:animal_categories,id',
            'item_name'   => 'nullable|string|max:100',
            'quantity'    => 'required|numeric|min:0',
            'unit'        => 'nullable|string|max:50',
            'notes'       => 'nullable|string',
            'sector_id'   => 'nullable|integer',
        ]);

        return response()->json(FarmProduction::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $prod = FarmProduction::findOrFail($id);
        $data = $request->validate([
            'date'        => 'required|date',
            'category_id' => 'nullable|integer|exists:animal_categories,id',
            'item_name'   => 'nullable|string|max:100',
            'quantity'    => 'required|numeric|min:0',
            'unit'        => 'nullable|string|max:50',
            'notes'       => 'nullable|string',
            'sector_id'   => 'nullable|integer',
        ]);
        $prod->update($data);
        return response()->json($prod);
    }

    public function destroy($id)
    {
        $prod = FarmProduction::findOrFail($id);
        $prod->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

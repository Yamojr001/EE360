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
            'date'        => 'required|date',
            'category_id' => 'nullable|integer|exists:animal_categories,id',
            'item_name'   => 'nullable|string|max:100',
            'quantity'    => 'required|numeric|min:0',
            'unit'        => 'nullable|string|max:50',
            'notes'       => 'nullable|string',
            'sector_id'   => 'nullable|integer',
        ]);

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

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

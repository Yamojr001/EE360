<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query();
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

        return $query->orderBy('category')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:150',
            'category'        => 'required|string',
            'quantity'        => 'required|numeric|min:0',
            'unit'            => 'nullable|string|max:30',
            'units_per_package' => 'nullable|integer|min:1',
            'unit_cost'       => 'numeric|min:0',
            'min_stock_level' => 'numeric|min:0',
            'supplier'        => 'nullable|string|max:100',
            'notes'           => 'nullable|string',
            'sector_id'       => 'nullable|integer',
        ]);

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        return response()->json(InventoryItem::create($data), 201);
    }

    public function update(Request $request, InventoryItem $inventory)
    {
        $data = $request->validate([
            'name'            => 'string|max:150',
            'category'        => 'string',
            'quantity'        => 'numeric|min:0',
            'unit'            => 'nullable|string|max:30',
            'units_per_package' => 'nullable|integer|min:1',
            'unit_cost'       => 'numeric|min:0',
            'min_stock_level' => 'numeric|min:0',
            'supplier'        => 'nullable|string|max:100',
            'notes'           => 'nullable|string',
            'sector_id'       => 'nullable|integer',
        ]);

        $inventory->update($data);
        return $inventory;
    }

    public function destroy(InventoryItem $inventory)
    {
        $inventory->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

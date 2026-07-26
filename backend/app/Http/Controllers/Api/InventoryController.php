<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::orderBy('category')->orderBy('name');
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->get();
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

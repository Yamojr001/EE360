<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterProduction;
use Illuminate\Http\Request;

class WaterProductionController extends Controller
{
    public function index(Request $request)
    {
        $query = WaterProduction::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->with('deleter')->orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'          => 'required|date',
            'product_type'  => 'nullable|string|max:50',
            'unit'          => 'nullable|string|max:50',
            'bags_produced' => 'required|integer|min:0',
            'liters_used'   => 'numeric|min:0',
            'cost'          => 'numeric|min:0',
            'bags_wasted'   => 'nullable|integer|min:0',
            'waste_reason'  => 'nullable|string',
            'notes'         => 'nullable|string',
            'sector_id'     => 'nullable|integer',
            'items_used'    => 'nullable|array',
            'items_used.*.inventory_id' => 'required_with:items_used|integer|exists:inventory_items,id',
            'items_used.*.quantity'     => 'required_with:items_used|numeric|min:0',
        ]);

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            $production = WaterProduction::create(\Illuminate\Support\Arr::except($data, ['items_used']));

            if (!empty($data['items_used'])) {
                foreach ($data['items_used'] as $used) {
                    $item = \App\Models\InventoryItem::find($used['inventory_id']);
                    if ($item) {
                        $item->quantity -= $used['quantity'];
                        $item->save();
                    }
                }
            }
            \Illuminate\Support\Facades\DB::commit();
            return response()->json($production, 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['error' => 'Failed to log production', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        WaterProduction::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

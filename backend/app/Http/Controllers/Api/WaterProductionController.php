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
        if (\Illuminate\Support\Facades\Schema::hasColumn('water_productions', 'deleted_by')) {
            $query->with('deleter');
        }
        return $query->orderByDesc('date')->get();
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
            'price_per_bag' => 'nullable|numeric|min:0',
            'bags_wasted'   => 'nullable|integer|min:0',
            'waste_reason'  => 'nullable|string',
            'notes'         => 'nullable|string',
            'sector_id'     => 'nullable|integer',
            'items_used'    => 'nullable|array',
            'items_used.*.inventory_id' => 'required_with:items_used|integer|exists:inventory_items,id',
            'items_used.*.quantity'     => 'required_with:items_used|numeric|min:0',
        ]);

        \App\Support\DatabaseSchemaEnsurer::ensureWaterProductionColumns();
        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            $insertData = \Illuminate\Support\Arr::except($data, ['items_used']);
            $insertData = \App\Support\DatabaseSchemaEnsurer::filterData('water_productions', $insertData);
            if (!\Illuminate\Support\Facades\Schema::hasColumn('water_productions', 'price_per_bag')) {
                unset($insertData['price_per_bag']);
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('water_productions', 'product_type')) {
                unset($insertData['product_type'], $insertData['unit']);
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('water_productions', 'bags_wasted')) {
                unset($insertData['bags_wasted'], $insertData['waste_reason']);
            }
            $production = WaterProduction::create($insertData);

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

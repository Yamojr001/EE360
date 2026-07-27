<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HatcheryRecord;

class HatcheryRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = HatcheryRecord::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->orderBy('date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sector_id'    => 'nullable|integer',
            'date'         => 'required|date',
            'batch_number' => 'nullable|string|max:100',
            'animal_type'  => 'required|string|max:100',
            'eggs_set'     => 'required|integer|min:0',
            'eggs_hatched' => 'required|integer|min:0',
            'mortality'    => 'required|integer|min:0',
            'notes'        => 'nullable|string'
        ]);

        return response()->json(HatcheryRecord::create($data), 201);
    }

    public function update(Request $request, HatcheryRecord $hatchery)
    {
        $data = $request->validate([
            'date'         => 'date',
            'batch_number' => 'nullable|string|max:100',
            'animal_type'  => 'string|max:100',
            'eggs_set'     => 'integer|min:0',
            'eggs_hatched' => 'integer|min:0',
            'mortality'    => 'integer|min:0',
            'notes'        => 'nullable|string'
        ]);

        $hatchery->update($data);
        return response()->json($hatchery);
    }

    public function destroy(HatcheryRecord $hatchery)
    {
        $hatchery->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

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

        \App\Support\DatabaseSchemaEnsurer::ensureHatcheryColumns();
        if ($request->filled('hatch_type') && \Illuminate\Support\Facades\Schema::hasColumn('hatchery_records', 'hatch_type')) {
            $query->where('hatch_type', $request->query('hatch_type'));
        }

        return $query->orderBy('date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sector_id'         => 'nullable|integer',
            'date'              => 'required|date',
            'batch_number'      => 'nullable|string|max:100',
            'animal_type'       => 'required|string|max:100',
            'hatch_type'        => 'nullable|in:internal,external',
            'external_provider' => 'nullable|string|max:255',
            'external_contact'  => 'nullable|string|max:100',
            'cost'              => 'nullable|numeric|min:0',
            'eggs_set'          => 'required|integer|min:0',
            'eggs_hatched'      => 'required|integer|min:0',
            'mortality'         => 'required|integer|min:0',
            'notes'             => 'nullable|string'
        ]);

        if (empty($data['hatch_type'])) {
            $data['hatch_type'] = 'internal';
        }

        if ($data['hatch_type'] === 'internal') {
            $data['external_provider'] = null;
            $data['external_contact'] = null;
            $data['cost'] = 0;
        }

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        \App\Support\DatabaseSchemaEnsurer::ensureHatcheryColumns();
        $insertData = \App\Support\DatabaseSchemaEnsurer::filterData('hatchery_records', $data);

        return response()->json(HatcheryRecord::create($insertData), 201);
    }

    public function update(Request $request, HatcheryRecord $hatchery)
    {
        $data = $request->validate([
            'date'              => 'date',
            'batch_number'      => 'nullable|string|max:100',
            'animal_type'       => 'string|max:100',
            'hatch_type'        => 'nullable|in:internal,external',
            'external_provider' => 'nullable|string|max:255',
            'external_contact'  => 'nullable|string|max:100',
            'cost'              => 'nullable|numeric|min:0',
            'eggs_set'          => 'integer|min:0',
            'eggs_hatched'      => 'integer|min:0',
            'mortality'         => 'integer|min:0',
            'notes'             => 'nullable|string'
        ]);

        if (isset($data['hatch_type']) && $data['hatch_type'] === 'internal') {
            $data['external_provider'] = null;
            $data['external_contact'] = null;
            $data['cost'] = 0;
        }

        \App\Support\DatabaseSchemaEnsurer::ensureHatcheryColumns();
        $updateData = \App\Support\DatabaseSchemaEnsurer::filterData('hatchery_records', $data);

        $hatchery->update($updateData);
        return response()->json($hatchery);
    }

    public function destroy(HatcheryRecord $hatchery)
    {
        $hatchery->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

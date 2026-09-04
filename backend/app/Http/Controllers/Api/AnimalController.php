<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    public function index(Request $request)
    {
        $query = Animal::query();
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

        return $query->orderBy('type')->orderBy('tag_id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'           => 'required|string',
            'tag_id'         => 'nullable|string|max:50',
            'breed'          => 'nullable|string|max:100',
            'age_months'     => 'integer|min:0',
            'quantity'       => 'integer|min:1',
            'status'         => 'required|in:active,sick,sold,deceased',
            'purchase_price' => 'numeric|min:0',
            'current_value'  => 'numeric|min:0',
            'notes'          => 'nullable|string',
            'sector_id'      => 'nullable|integer',
        ]);

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        return response()->json(Animal::create($data), 201);
    }

    public function update(Request $request, Animal $livestock)
    {
        $data = $request->validate([
            'type'           => 'string',
            'tag_id'         => 'nullable|string|max:50',
            'breed'          => 'nullable|string|max:100',
            'age_months'     => 'integer|min:0',
            'quantity'       => 'integer|min:1',
            'status'         => 'in:active,sick,sold,deceased',
            'purchase_price' => 'numeric|min:0',
            'current_value'  => 'numeric|min:0',
            'notes'          => 'nullable|string',
        ]);

        $livestock->update($data);
        return $livestock;
    }

    public function destroy(Animal $livestock)
    {
        $livestock->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

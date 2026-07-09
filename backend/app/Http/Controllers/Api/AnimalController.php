<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    public function index()
    {
        return Animal::orderBy('type')->orderBy('tag_id')->get();
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
        ]);

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

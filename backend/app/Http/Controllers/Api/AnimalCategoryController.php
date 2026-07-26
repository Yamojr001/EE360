<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AnimalCategory;

class AnimalCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = AnimalCategory::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:animal,product',
            'sector_id' => 'nullable|integer',
        ]);

        $category = AnimalCategory::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = AnimalCategory::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:animal,product',
            'sector_id' => 'nullable|integer',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = AnimalCategory::findOrFail($id);
        if (auth()->check()) {
            $category->deleted_by = auth()->id();
            $category->save();
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}

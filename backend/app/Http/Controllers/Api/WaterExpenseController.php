<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterExpense;
use Illuminate\Http\Request;

class WaterExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = WaterExpense::query();
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return response()->json($query->orderByDesc('date')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'vendor' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'sector_id' => 'nullable|integer',
        ]);

        $expense = WaterExpense::create($validated);
        return response()->json($expense, 201);
    }

    public function destroy($id)
    {
        $expense = WaterExpense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

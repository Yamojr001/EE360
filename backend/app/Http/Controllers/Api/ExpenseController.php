<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'        => 'required|date',
            'category'    => 'required|string',
            'description' => 'required|string|max:300',
            'amount'      => 'required|numeric|min:0',
            'vendor'      => 'nullable|string|max:100',
            'notes'       => 'nullable|string',
        ]);

        return response()->json(Expense::create($data), 201);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

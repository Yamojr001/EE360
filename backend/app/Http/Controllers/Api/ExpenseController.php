<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::query();
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

        return $query->orderByDesc('date')->orderByDesc('id')->get();
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
            'sector_id'   => 'nullable|integer',
        ]);

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        return response()->json(Expense::create($data), 201);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

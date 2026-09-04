<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::query();
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
            'date'         => 'required|date',
            'category'     => 'required|string',
            'item'         => 'required|string|max:200',
            'quantity'     => 'numeric|min:0',
            'unit'         => 'nullable|string|max:30',
            'unit_price'   => 'numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'amount_paid'  => 'nullable|numeric|min:0',
            'buyer'        => 'nullable|string|max:100',
            'customer_id'  => 'nullable|integer',
            'notes'        => 'nullable|string',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'sector_id'    => 'nullable|integer',
        ]);

        $user = $request->user();
        if (empty($data['sector_id'])) {
            if ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1; // Default Farm sector
            }
        }

        if (isset($data['amount_paid'])) {
            $data['payment_status'] = $data['amount_paid'] >= $data['total_amount'] ? 'paid' : 'partial';
        }

        return response()->json(Sale::create($data), 201);
    }

    public function update(Request $request, Sale $sale)
    {
        $data = $request->validate([
            'amount_paid'  => 'required|numeric|min:0',
            'payment_status' => 'nullable|string',
        ]);

        $amount_paid = $data['amount_paid'];
        $status = $amount_paid >= $sale->total_amount ? 'paid' : 'partial';

        $sale->update([
            'amount_paid' => $amount_paid,
            'payment_status' => $status
        ]);

        return response()->json($sale);
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

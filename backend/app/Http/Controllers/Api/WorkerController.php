<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Worker::orderBy('name');

        $targetSector = null;
        if ($user && $user->role === 'water_manager') {
            $targetSector = 2;
        } elseif ($user && $user->role === 'farm_manager') {
            $targetSector = 1;
        } elseif ($request->filled('sector_id')) {
            $targetSector = (int) $request->sector_id;
        } elseif ($request->filled('sector')) {
            $targetSector = $request->sector === 'water' ? 2 : 1;
        }

        if ($targetSector === 2) {
            $query->where('sector_id', 2);
        } elseif ($targetSector === 1) {
            $query->where(function ($q) {
                $q->where('sector_id', 1)->orWhereNull('sector_id');
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'nullable|string|max:80',
            'role_title' => 'nullable|string|max:80',
            'phone'      => 'nullable|string|max:20',
            'salary'     => 'numeric|min:0',
            'hire_date'  => 'nullable|date',
            'status'     => 'required|in:active,inactive,on_leave,terminated',
            'address'    => 'nullable|string|max:200',
            'notes'      => 'nullable|string',
            'sector_id'  => 'nullable|integer',
            'sector'     => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        
        $user = $request->user();
        $data['manager_id'] = $user ? $user->id : 1;

        if (empty($data['role']) && !empty($data['role_title'])) {
            $data['role'] = $data['role_title'];
        }
        if (empty($data['role'])) {
            $data['role'] = 'Staff Member';
        }

        if (empty($data['sector_id'])) {
            if (isset($data['sector']) && $data['sector'] === 'water') {
                $data['sector_id'] = 2;
            } elseif (isset($data['sector']) && $data['sector'] === 'farm') {
                $data['sector_id'] = 1;
            } elseif ($user && $user->role === 'water_manager') {
                $data['sector_id'] = 2;
            } else {
                $data['sector_id'] = 1;
            }
        }

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
        }

        return response()->json(Worker::create($data), 201);
    }

    public function update(Request $request, Worker $worker)
    {
        $data = $request->validate([
            'name'       => 'string|max:100',
            'role'       => 'nullable|string|max:80',
            'role_title' => 'nullable|string|max:80',
            'phone'      => 'nullable|string|max:20',
            'salary'     => 'numeric|min:0',
            'hire_date'  => 'nullable|date',
            'status'     => 'in:active,inactive,on_leave,terminated',
            'address'    => 'nullable|string|max:200',
            'notes'      => 'nullable|string',
            'sector_id'  => 'nullable|integer',
            'sector'     => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if (empty($data['role']) && !empty($data['role_title'])) {
            $data['role'] = $data['role_title'];
        }

        if (empty($data['sector_id']) && isset($data['sector'])) {
            $data['sector_id'] = $data['sector'] === 'water' ? 2 : 1;
        }

        if ($request->hasFile('photo')) {
            if ($worker->photo && \Illuminate\Support\Facades\Storage::disk('public')->exists($worker->photo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($worker->photo);
            }
            $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
        }

        $worker->update($data);
        return response()->json($worker);
    }

    public function destroy(Worker $worker)
    {
        $worker->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

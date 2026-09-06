<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            'salary'     => 'nullable|numeric|min:0',
            'hire_date'  => 'nullable|date',
            'status'     => 'required|in:active,inactive,on_leave,terminated',
            'address'    => 'nullable|string|max:200',
            'notes'      => 'nullable|string',
            'sector_id'  => 'nullable',
            'sector'     => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        
        $user = $request->user();
        $data['manager_id'] = ($user && User::where('id', $user->id)->exists()) ? $user->id : null;

        if (empty($data['role']) && !empty($data['role_title'])) {
            $data['role'] = $data['role_title'];
        }
        if (empty($data['role'])) {
            $data['role'] = 'Staff Member';
        }

        $data['salary'] = isset($data['salary']) && $data['salary'] !== '' ? (float) $data['salary'] : 0;

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
        } else {
            $data['sector_id'] = (int) $data['sector_id'];
        }

        if ($request->hasFile('photo')) {
            try {
                $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
            } catch (\Throwable $e) {
                Log::warning('Worker photo storage failed: ' . $e->getMessage());
            }
        }

        try {
            $worker = Worker::create($data);
            return response()->json($worker, 201);
        } catch (\Throwable $e) {
            Log::error('Failed to create worker: ' . $e->getMessage(), [
                'data' => $data,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to create worker: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Worker $worker)
    {
        $data = $request->validate([
            'name'       => 'string|max:100',
            'role'       => 'nullable|string|max:80',
            'role_title' => 'nullable|string|max:80',
            'phone'      => 'nullable|string|max:20',
            'salary'     => 'nullable|numeric|min:0',
            'hire_date'  => 'nullable|date',
            'status'     => 'in:active,inactive,on_leave,terminated',
            'address'    => 'nullable|string|max:200',
            'notes'      => 'nullable|string',
            'sector_id'  => 'nullable',
            'sector'     => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if (empty($data['role']) && !empty($data['role_title'])) {
            $data['role'] = $data['role_title'];
        }

        if (isset($data['salary']) && $data['salary'] !== '') {
            $data['salary'] = (float) $data['salary'];
        }

        if (empty($data['sector_id']) && isset($data['sector'])) {
            $data['sector_id'] = $data['sector'] === 'water' ? 2 : 1;
        } elseif (!empty($data['sector_id'])) {
            $data['sector_id'] = (int) $data['sector_id'];
        }

        if ($request->hasFile('photo')) {
            try {
                if ($worker->photo && Storage::disk('public')->exists($worker->photo)) {
                    Storage::disk('public')->delete($worker->photo);
                }
                $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
            } catch (\Throwable $e) {
                Log::warning('Worker photo update failed: ' . $e->getMessage());
            }
        }

        try {
            $worker->update($data);
            return response()->json($worker);
        } catch (\Throwable $e) {
            Log::error('Failed to update worker: ' . $e->getMessage(), [
                'data' => $data,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to update worker: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Worker $worker)
    {
        if (request()->user()) {
            $worker->deleted_by = request()->user()->id;
            $worker->save();
        }
        $worker->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

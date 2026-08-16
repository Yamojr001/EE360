<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    public function index(Request $request)
    {
        $query = Worker::orderBy('name');
        if ($request->filled('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }
        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'role'      => 'required|string|max:80',
            'phone'     => 'nullable|string|max:20',
            'salary'    => 'numeric|min:0',
            'hire_date' => 'date',
            'status'    => 'required|in:active,inactive,on_leave',
            'address'   => 'nullable|string|max:200',
            'notes'     => 'nullable|string',
            'sector_id' => 'nullable|integer',
            'photo'     => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        
        $data['manager_id'] = request()->user()->id;

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
        }

        return response()->json(Worker::create($data), 201);
    }

    public function update(Request $request, Worker $worker)
    {
        $data = $request->validate([
            'name'      => 'string|max:100',
            'role'      => 'string|max:80',
            'phone'     => 'nullable|string|max:20',
            'salary'    => 'numeric|min:0',
            'hire_date' => 'date',
            'status'    => 'in:active,inactive,on_leave',
            'address'   => 'nullable|string|max:200',
            'notes'     => 'nullable|string',
            'sector_id' => 'nullable|integer',
            'photo'     => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($worker->photo && \Illuminate\Support\Facades\Storage::disk('public')->exists($worker->photo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($worker->photo);
            }
            $data['photo'] = $request->file('photo')->store('worker-photos', 'public');
        }

        $worker->update($data);
        return $worker;
    }

    public function destroy(Worker $worker)
    {
        $worker->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

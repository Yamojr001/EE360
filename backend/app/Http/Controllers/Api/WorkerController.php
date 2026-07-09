<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    public function index()
    {
        return Worker::orderBy('name')->get();
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
        ]);

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
        ]);

        $worker->update($data);
        return $worker;
    }

    public function destroy(Worker $worker)
    {
        $worker->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

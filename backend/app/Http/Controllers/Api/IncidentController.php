<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Incident::with(['reporter:id,name,role', 'sector:id,name'])
            ->orderBy('reported_date', 'desc')
            ->orderBy('id', 'desc');

        if ($request->filled('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('severity') && $request->severity !== 'all') {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'category'         => 'required|string',
            'severity'         => 'nullable|string|in:low,medium,high,critical',
            'status'           => 'nullable|string|in:open,in_progress,resolved',
            'reported_date'    => 'required|date',
            'sector_id'        => 'nullable|integer',
            'resolution_notes' => 'nullable|string',
            'image'            => 'nullable|image|max:10240', // max 10MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('incidents', 'public');
        }

        $user = $request->user();
        $sectorId = $validated['sector_id'] ?? null;
        if (empty($sectorId) && $user) {
            if ($user->role === 'water_manager') {
                $sectorId = 2;
            } elseif ($user->role === 'farm_manager') {
                $sectorId = 1;
            }
        }

        // Guard: verify the sector actually exists to prevent FK constraint violation
        if ($sectorId && !\Illuminate\Support\Facades\DB::table('sectors')->where('id', $sectorId)->exists()) {
            $sectorId = null;
        }

        $incident = Incident::create([
            'title'            => $validated['title'],
            'description'      => $validated['description'],
            'category'         => $validated['category'],
            'severity'         => $validated['severity'] ?? 'medium',
            'status'           => $validated['status'] ?? 'open',
            'reported_date'    => $validated['reported_date'],
            'sector_id'        => $sectorId,
            'reported_by'      => $user ? $user->id : null,
            'resolution_notes' => $validated['resolution_notes'] ?? null,
            'image_path'       => $imagePath,
        ]);

        return response()->json($incident->load(['reporter:id,name,role', 'sector:id,name']), 201);
    }

    public function show(Incident $incident)
    {
        return response()->json($incident->load(['reporter:id,name,role', 'sector:id,name']));
    }

    public function update(Request $request, Incident $incident)
    {
        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'description'      => 'sometimes|string',
            'category'         => 'sometimes|string',
            'severity'         => 'sometimes|string|in:low,medium,high,critical',
            'status'           => 'sometimes|string|in:open,in_progress,resolved',
            'reported_date'    => 'sometimes|date',
            'sector_id'        => 'nullable|integer',
            'resolution_notes' => 'nullable|string',
            'image'            => 'nullable|image|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($incident->image_path) {
                Storage::disk('public')->delete($incident->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('incidents', 'public');
        }

        $incident->update($validated);

        return response()->json($incident->load(['reporter:id,name,role', 'sector:id,name']));
    }

    public function destroy(Incident $incident)
    {
        if ($incident->image_path) {
            Storage::disk('public')->delete($incident->image_path);
        }
        $incident->delete();

        return response()->json(['message' => 'Incident report deleted successfully']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InternshipApplicationController extends Controller
{
    /**
     * Get public application settings (which intakes are open).
     */
    public function getPublicSettings()
    {
        $settings = DB::table('application_settings')->pluck('value', 'key');

        return response()->json([
            'siwes_open' => isset($settings['siwes_open']) ? (bool) $settings['siwes_open'] : true,
            'internship_open' => isset($settings['internship_open']) ? (bool) $settings['internship_open'] : true,
            'nysc_open' => isset($settings['nysc_open']) ? (bool) $settings['nysc_open'] : true,
        ]);
    }

    /**
     * Public submission of SIWES / Internship / NYSC application.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'institution' => 'nullable|string|max:255',
            'course_of_study' => 'nullable|string|max:255',
            'application_type' => 'required|in:siwes,internship,nysc',
            'duration_months' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'cover_letter' => 'nullable|string',
            'passport_photo' => 'nullable|image|max:5120',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:10240',
        ]);

        // Check if application intake is open
        $settingKey = strtolower($validated['application_type']) . '_open';
        $settingVal = DB::table('application_settings')->where('key', $settingKey)->value('value');
        if ($settingVal !== null && (string) $settingVal === '0') {
            return response()->json([
                'message' => 'Application intake for ' . strtoupper($validated['application_type']) . ' is currently closed.'
            ], 422);
        }

        if ($request->hasFile('passport_photo')) {
            $validated['passport_photo'] = $request->file('passport_photo')->store('applications/passports', 'public');
        }

        if ($request->hasFile('document_path')) {
            $validated['document_path'] = $request->file('document_path')->store('applications/documents', 'public');
        }

        $validated['status'] = 'pending';

        $application = InternshipApplication::create($validated);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'data' => $application
        ], 201);
    }

    /**
     * Admin list applications.
     */
    public function index(Request $request)
    {
        $query = InternshipApplication::query();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('application_type', $request->type);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('full_name', 'like', $s)
                  ->orWhere('email', 'like', $s)
                  ->orWhere('phone', 'like', $s)
                  ->orWhere('institution', 'like', $s)
                  ->orWhere('course_of_study', 'like', $s);
            });
        }

        $applications = $query->orderBy('created_at', 'desc')->get();

        return response()->json($applications);
    }

    /**
     * Admin update application status or notes.
     */
    public function update(Request $request, $id)
    {
        $application = InternshipApplication::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|in:pending,accepted,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $application->update($validated);

        return response()->json([
            'message' => 'Application updated successfully',
            'data' => $application
        ]);
    }

    /**
     * Admin update settings (open/close intake for SIWES, Internship, NYSC).
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'siwes_open' => 'required|boolean',
            'internship_open' => 'required|boolean',
            'nysc_open' => 'required|boolean',
        ]);

        $keys = ['siwes_open', 'internship_open', 'nysc_open'];
        foreach ($keys as $k) {
            $val = $request->boolean($k) ? '1' : '0';
            DB::table('application_settings')->updateOrInsert(
                ['key' => $k],
                ['value' => $val, 'updated_at' => now()]
            );
        }

        return response()->json([
            'message' => 'Application portal intake settings updated successfully!'
        ]);
    }

    /**
     * Admin delete application.
     */
    public function destroy($id)
    {
        $application = InternshipApplication::findOrFail($id);
        $application->delete();

        return response()->json(['message' => 'Application deleted successfully']);
    }
}

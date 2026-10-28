<?php
namespace App\Http\Controllers\Api;

use App\Http\Resources\JobApplicationResource;
use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'status' => [
                'sometimes',
                'string',
                'in:applied,interview,offer,rejected',
            ],
            'search' => [
                'sometimes',
                'string',
                'max:100',
            ],
        ]);

        $query = $request->user()->jobApplications();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('company', 'like', '%' . $search . '%')
                    ->orWhere('position', 'like', '%' . $search . '%');
            });
        }

        $applications = $query->latest()->paginate(10);

        return JobApplicationResource::collection($applications);
    }
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'status' => [
                'required',
                'in:applied,interview,offer,rejected'
            ],
            'applied_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $application = $request->user()
            ->jobApplications()
            ->create($validated);

        return response()->json([
            'message' => 'Job application created successfully.',
            'application' => $application,
        ], 201);
    }
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => [
                'sometimes',
                'required',
                'in:applied,interview,offer,rejected'
            ],
            'applied_at' => ['sometimes', 'nullable', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        $application = $request->user()
            ->jobApplications()
            ->findOrFail($id);

        $application->update($validated);

        return response()->json([
            'message' => 'Job application updated successfully.',
            'application' => $application,
        ]);
    }
    public function destroy(Request $request, int $id): JsonResponse
    {
        $application = $request->user()
            ->jobApplications()
            ->findOrFail($id);

        $application->delete();

        return response()->json([
            'message' => 'Job application deleted successfully.',
        ]);
    }
    
}


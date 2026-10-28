<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });

    Route::get('/job-applications', [
        JobApplicationController::class,
        'index'
    ]);

    Route::post('/job-applications', [
        JobApplicationController::class,
        'store'
    ]);
    Route::patch('/job-applications/{id}', [
        JobApplicationController::class,
        'update'
    ]);

    Route::delete('/job-applications/{id}', [
        JobApplicationController::class,
        'destroy'
    ]);
});


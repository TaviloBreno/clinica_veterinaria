<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\VeterinarioController;
use App\Http\Controllers\ConsultaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rotas dos recursos principais
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('animals', AnimalController::class);
Route::apiResource('veterinarios', VeterinarioController::class);
Route::apiResource('consultas', ConsultaController::class);

// Rotas específicas
Route::get('clientes/{cliente}/animals', [ClienteController::class, 'animals']);
Route::get('animals/{animal}/consultas', [AnimalController::class, 'consultas']);
Route::get('veterinarios/{veterinario}/consultas', [VeterinarioController::class, 'consultas']);
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\VeterinarioController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\AuthController;

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

// Rota para obter token CSRF
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
});

// Rotas de autenticação (não protegidas)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rotas públicas para estatísticas básicas (sem dados sensíveis)
Route::get('/stats', function () {
    return response()->json([
        'clientes' => 0,
        'animais' => 0,
        'veterinarios' => 0,
        'consultas' => 0
    ]);
});

// Rotas protegidas por autenticação
Route::middleware('auth:web')->group(function () {
    // Rota do usuário autenticado
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rotas dos recursos principais
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('animals', AnimalController::class);
    Route::apiResource('veterinarios', VeterinarioController::class);
    Route::apiResource('consultas', ConsultaController::class);
    Route::apiResource('procedures', ProcedureController::class);

    // Rotas específicas
    Route::get('clientes/{cliente}/animals', [ClienteController::class, 'animals']);
    Route::get('animals/{animal}/consultas', [AnimalController::class, 'consultas']);
    Route::get('veterinarios/{veterinario}/consultas', [VeterinarioController::class, 'consultas']);
});

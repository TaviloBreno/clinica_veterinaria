<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return view('test');
});

// Rota de login necessária para os testes
Route::get('/login', function () {
    return response()->json(['message' => 'Login required'], 401);
})->name('login');

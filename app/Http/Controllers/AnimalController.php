<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $animals = Animal::with(['cliente', 'consultas'])->get();
        return response()->json($animals);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'especie' => 'required|string|max:255',
            'raca' => 'nullable|string|max:255',
            'sexo' => 'required|in:macho,femea',
            'data_nascimento' => 'nullable|date',
            'peso' => 'nullable|numeric|min:0',
            'cor' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
            'cliente_id' => 'required|exists:clientes,id',
        ]);

        $animal = Animal::create($request->all());
        return response()->json($animal->load('cliente'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Animal $animal)
    {
        $animal->load(['cliente', 'consultas']);
        return response()->json($animal);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Animal $animal)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'especie' => 'required|string|max:255',
            'raca' => 'nullable|string|max:255',
            'sexo' => 'required|in:macho,femea',
            'data_nascimento' => 'nullable|date',
            'peso' => 'nullable|numeric|min:0',
            'cor' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
            'cliente_id' => 'required|exists:clientes,id',
        ]);

        $animal->update($request->all());
        return response()->json($animal->load('cliente'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Animal $animal)
    {
        $animal->delete();
        return response()->json(null, 204);
    }

    /**
     * Get consultas of a specific animal
     */
    public function consultas(Animal $animal)
    {
        return response()->json($animal->consultas()->with('veterinario')->get());
    }
}

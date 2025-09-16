<?php

namespace App\Http\Controllers;

use App\Models\Veterinario;
use Illuminate\Http\Request;

class VeterinarioController extends Controller
{
    public function index()
    {
        $veterinarios = Veterinario::with('consultas')->get();
        return response()->json($veterinarios);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:veterinarios',
            'telefone' => 'required|string|max:20',
            'crmv' => 'required|string|unique:veterinarios',
            'especialidade' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        $veterinario = Veterinario::create($request->all());
        return response()->json($veterinario, 201);
    }

    public function show(Veterinario $veterinario)
    {
        $veterinario->load('consultas');
        return response()->json($veterinario);
    }

    public function update(Request $request, Veterinario $veterinario)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:veterinarios,email,' . $veterinario->id,
            'telefone' => 'required|string|max:20',
            'crmv' => 'required|string|unique:veterinarios,crmv,' . $veterinario->id,
            'especialidade' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        $veterinario->update($request->all());
        return response()->json($veterinario);
    }

    public function destroy(Veterinario $veterinario)
    {
        $veterinario->delete();
        return response()->json(null, 204);
    }

    public function consultas(Veterinario $veterinario)
    {
        return response()->json($veterinario->consultas()->with(['animal.cliente'])->get());
    }
}

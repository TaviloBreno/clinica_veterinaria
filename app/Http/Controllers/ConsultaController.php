<?php

namespace App\Http\Controllers;

use App\Models\Consulta;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    public function index()
    {
        $consultas = Consulta::with(['animal.cliente', 'veterinario'])->get();
        return response()->json($consultas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'veterinario_id' => 'required|exists:veterinarios,id',
            'data_consulta' => 'required|date',
            'motivo' => 'required|string',
            'diagnostico' => 'nullable|string',
            'tratamento' => 'nullable|string',
            'observacoes' => 'nullable|string',
            'valor' => 'nullable|numeric|min:0',
            'status' => 'required|in:agendada,realizada,cancelada',
        ]);

        $consulta = Consulta::create($request->all());
        return response()->json($consulta->load(['animal.cliente', 'veterinario']), 201);
    }

    public function show(Consulta $consulta)
    {
        $consulta->load(['animal.cliente', 'veterinario']);
        return response()->json($consulta);
    }

    public function update(Request $request, Consulta $consulta)
    {
        $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'veterinario_id' => 'required|exists:veterinarios,id',
            'data_consulta' => 'required|date',
            'motivo' => 'required|string',
            'diagnostico' => 'nullable|string',
            'tratamento' => 'nullable|string',
            'observacoes' => 'nullable|string',
            'valor' => 'nullable|numeric|min:0',
            'status' => 'required|in:agendada,realizada,cancelada',
        ]);

        $consulta->update($request->all());
        return response()->json($consulta->load(['animal.cliente', 'veterinario']));
    }

    public function destroy(Consulta $consulta)
    {
        $consulta->delete();
        return response()->json(null, 204);
    }
}

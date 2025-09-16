<?php

namespace App\Http\Controllers;

use App\Models\Procedure;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $procedures = Procedure::orderBy('nome')->get();
        return response()->json($procedures);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Retorna categorias disponíveis para o formulário
        $categorias = [
            'consulta' => 'Consulta',
            'cirurgia' => 'Cirurgia',
            'exame' => 'Exame',
            'vacinacao' => 'Vacinação',
            'procedimento' => 'Procedimento Geral',
            'emergencia' => 'Emergência'
        ];
        
        return response()->json(['categorias' => $categorias]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0',
            'duracao_minutos' => 'required|integer|min:1',
            'categoria' => 'required|string|max:255',
            'observacoes' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        $procedure = Procedure::create($validated);
        return response()->json($procedure, 201);
    }
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Procedure $procedure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Procedure $procedure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Procedure $procedure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Procedure $procedure)
    {
        //
    }
}

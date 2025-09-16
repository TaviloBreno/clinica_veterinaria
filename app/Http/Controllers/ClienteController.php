<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clientes = Cliente::with('animals')->get();
        return response()->json($clientes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes',
            'telefone' => 'required|string|max:20',
            'cpf' => 'required|string|size:11|unique:clientes',
            'endereco' => 'required|string',
            'cidade' => 'required|string|max:255',
            'estado' => 'required|string|size:2',
            'cep' => 'required|string|size:8',
        ]);

        $cliente = Cliente::create($request->all());
        return response()->json($cliente, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        $cliente->load('animals');
        return response()->json($cliente);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cliente $cliente)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email,' . $cliente->id,
            'telefone' => 'required|string|max:20',
            'cpf' => 'required|string|size:11|unique:clientes,cpf,' . $cliente->id,
            'endereco' => 'required|string',
            'cidade' => 'required|string|max:255',
            'estado' => 'required|string|size:2',
            'cep' => 'required|string|size:8',
        ]);

        $cliente->update($request->all());
        return response()->json($cliente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->delete();
        return response()->json(null, 204);
    }

    /**
     * Get animals of a specific client
     */
    public function animals(Cliente $cliente)
    {
        return response()->json($cliente->animals);
    }
}

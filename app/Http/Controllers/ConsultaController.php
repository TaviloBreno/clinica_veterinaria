<?php

namespace App\Http\Controllers;

use App\Models\Consulta;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Procedure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsultaController extends Controller
{
    public function index()
    {
        $consultas = Consulta::with(['animal.cliente', 'veterinario', 'procedures'])
                           ->orderBy('data_consulta', 'desc')
                           ->get();
        return response()->json($consultas);
    }

    public function create()
    {
        // Retornar dados necessários para o formulário
        $animais = Animal::with('cliente')->get();
        $veterinarios = Veterinario::all();
        $procedures = Procedure::ativo()->get();

        return response()->json([
            'animais' => $animais,
            'veterinarios' => $veterinarios,
            'procedures' => $procedures
        ]);
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
            'status' => 'required|in:agendada,realizada,cancelada',
            'procedures' => 'nullable|array',
            'procedures.*.id' => 'required|exists:procedures,id',
            'procedures.*.quantidade' => 'required|integer|min:1',
            'procedures.*.valor_unitario' => 'required|numeric|min:0',
            'procedures.*.observacoes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Criar a consulta
            $consulta = Consulta::create($request->only([
                'animal_id',
                'veterinario_id',
                'data_consulta',
                'motivo',
                'diagnostico',
                'tratamento',
                'observacoes',
                'status'
            ]));

            // Adicionar procedimentos se fornecidos
            if ($request->has('procedures')) {
                foreach ($request->procedures as $procedure) {
                    $consulta->procedures()->attach($procedure['id'], [
                        'quantidade' => $procedure['quantidade'],
                        'valor_unitario' => $procedure['valor_unitario'],
                        'observacoes' => $procedure['observacoes'] ?? null,
                    ]);
                }
            }

            // Calcular valor total da consulta
            $valorTotal = $consulta->procedures->sum(function ($procedure) {
                return $procedure->pivot->quantidade * $procedure->pivot->valor_unitario;
            });
            
            $consulta->update(['valor' => $valorTotal]);

            DB::commit();

            return response()->json($consulta->load(['animal.cliente', 'veterinario', 'procedures']), 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Erro ao criar consulta: ' . $e->getMessage()], 500);
        }
    }

    public function show(Consulta $consulta)
    {
        $consulta->load(['animal.cliente', 'veterinario', 'procedures']);
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
            'status' => 'required|in:agendada,realizada,cancelada',
            'procedures' => 'nullable|array',
            'procedures.*.id' => 'required|exists:procedures,id',
            'procedures.*.quantidade' => 'required|integer|min:1',
            'procedures.*.valor_unitario' => 'required|numeric|min:0',
            'procedures.*.observacoes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Atualizar dados da consulta
            $consulta->update($request->only([
                'animal_id',
                'veterinario_id',
                'data_consulta',
                'motivo',
                'diagnostico',
                'tratamento',
                'observacoes',
                'status'
            ]));

            // Remover procedimentos antigos
            $consulta->procedures()->detach();

            // Adicionar novos procedimentos
            if ($request->has('procedures')) {
                foreach ($request->procedures as $procedure) {
                    $consulta->procedures()->attach($procedure['id'], [
                        'quantidade' => $procedure['quantidade'],
                        'valor_unitario' => $procedure['valor_unitario'],
                        'observacoes' => $procedure['observacoes'] ?? null,
                    ]);
                }
            }

            // Recalcular valor total
            $valorTotal = $consulta->procedures->sum(function ($procedure) {
                return $procedure->pivot->quantidade * $procedure->pivot->valor_unitario;
            });
            
            $consulta->update(['valor' => $valorTotal]);

            DB::commit();

            return response()->json($consulta->load(['animal.cliente', 'veterinario', 'procedures']));
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Erro ao atualizar consulta: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Consulta $consulta)
    {
        try {
            // Remover relacionamentos com procedimentos
            $consulta->procedures()->detach();
            
            // Excluir a consulta
            $consulta->delete();
            
            return response()->json(['message' => 'Consulta excluída com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir consulta: ' . $e->getMessage()], 500);
        }
    }
}
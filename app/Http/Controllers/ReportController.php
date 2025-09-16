<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Consulta;
use App\Models\Procedure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Retorna dados gerais para o dashboard de relatórios
     */
    public function index()
    {
        $stats = [
            'total_clientes' => Cliente::count(),
            'total_animais' => Animal::count(),
            'total_veterinarios' => Veterinario::count(),
            'total_consultas' => Consulta::count(),
            'total_procedures' => Procedure::count(),
            'consultas_mes_atual' => Consulta::whereMonth('data_consulta', Carbon::now()->month)
                                           ->whereYear('data_consulta', Carbon::now()->year)
                                           ->count(),
            'receita_mes_atual' => Consulta::whereMonth('data_consulta', Carbon::now()->month)
                                          ->whereYear('data_consulta', Carbon::now()->year)
                                          ->sum('valor'),
            'consultas_pendentes' => Consulta::where('status', 'agendada')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Relatório de clientes
     */
    public function clientReport(Request $request)
    {
        $query = Cliente::with(['animals']);

        // Filtros opcionais
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('telefone', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('created_from') && $request->created_from) {
            $query->whereDate('created_at', '>=', $request->created_from);
        }

        if ($request->has('created_to') && $request->created_to) {
            $query->whereDate('created_at', '<=', $request->created_to);
        }

        $clientes = $query->orderBy('created_at', 'desc')->get();

        // Estatísticas dos clientes
        $stats = [
            'total_clientes' => $clientes->count(),
            'clientes_com_animais' => $clientes->filter(function($cliente) {
                return $cliente->animals->count() > 0;
            })->count(),
            'media_animais_por_cliente' => $clientes->count() > 0
                ? round($clientes->sum(function($cliente) { return $cliente->animals->count(); }) / $clientes->count(), 2)
                : 0,
            'clientes_por_mes' => Cliente::selectRaw('MONTH(created_at) as mes, COUNT(*) as total')
                                        ->whereYear('created_at', Carbon::now()->year)
                                        ->groupBy('mes')
                                        ->orderBy('mes')
                                        ->get()
        ];

        return response()->json([
            'clientes' => $clientes,
            'stats' => $stats
        ]);
    }

    /**
     * Relatório de animais
     */
    public function petReport(Request $request)
    {
        $query = Animal::with(['cliente', 'consultas']);

        // Filtros opcionais
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('especie', 'like', "%{$request->search}%")
                  ->orWhere('raca', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('especie') && $request->especie) {
            $query->where('especie', $request->especie);
        }

        if ($request->has('sexo') && $request->sexo) {
            $query->where('sexo', $request->sexo);
        }

        if ($request->has('created_from') && $request->created_from) {
            $query->whereDate('created_at', '>=', $request->created_from);
        }

        if ($request->has('created_to') && $request->created_to) {
            $query->whereDate('created_at', '<=', $request->created_to);
        }

        $animals = $query->orderBy('created_at', 'desc')->get();

        // Estatísticas dos animais
        $stats = [
            'total_animals' => $animals->count(),
            'especies_diferentes' => Animal::distinct('especie')->count('especie'),
            'machos' => Animal::where('sexo', 'macho')->count(),
            'femeas' => Animal::where('sexo', 'femea')->count(),
            'distribuicao_especies' => Animal::selectRaw('especie as name, COUNT(*) as value')
                                          ->groupBy('especie')
                                          ->orderBy('value', 'desc')
                                          ->get(),
            'animais_por_mes' => Animal::selectRaw('MONTH(created_at) as mes, COUNT(*) as total')
                                        ->whereYear('created_at', Carbon::now()->year)
                                        ->groupBy('mes')
                                        ->orderBy('mes')
                                        ->get()
                                        ->map(function($item) {
                                            $item->mes = Carbon::create()->month($item->mes)->format('M');
                                            return $item;
                                        })
        ];

        return response()->json([
            'animals' => $animals,
            'stats' => $stats
        ]);
    }

    /**
     * Relatório de procedimentos
     */
    public function procedureReport(Request $request)
    {
        $query = Procedure::withCount('consultas');

        // Filtros opcionais
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('descricao', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('ativo')) {
            $query->where('ativo', $request->ativo);
        }

        if ($request->has('preco_min') && $request->preco_min) {
            $query->where('preco', '>=', $request->preco_min);
        }

        if ($request->has('preco_max') && $request->preco_max) {
            $query->where('preco', '<=', $request->preco_max);
        }

        $procedures = $query->orderBy('consultas_count', 'desc')->get();

        // Estatísticas dos procedimentos
        $stats = [
            'total_procedures' => $procedures->count(),
            'procedures_ativos' => $procedures->where('ativo', true)->count(),
            'preco_medio' => round($procedures->avg('preco'), 2),
            'procedure_mais_usado' => $procedures->sortByDesc('consultas_count')->first(),
            'receita_total_procedures' => DB::table('consulta_procedures')
                                            ->sum(DB::raw('quantidade * valor_unitario'))
        ];

        return response()->json([
            'procedures' => $procedures,
            'stats' => $stats
        ]);
    }

    /**
     * Relatório de veterinários
     */
    public function veterinarianReport(Request $request)
    {
        $query = Veterinario::withCount('consultas');

        // Filtros opcionais
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('especialidade', 'like', "%{$request->search}%")
                  ->orWhere('crmv', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('especialidade') && $request->especialidade) {
            $query->where('especialidade', $request->especialidade);
        }

        $veterinarios = $query->orderBy('consultas_count', 'desc')->get();

        // Estatísticas dos veterinários
        $stats = [
            'total_veterinarios' => $veterinarios->count(),
            'especialidades' => Veterinario::selectRaw('especialidade, COUNT(*) as total')
                                          ->groupBy('especialidade')
                                          ->orderBy('total', 'desc')
                                          ->get(),
            'veterinario_mais_ativo' => $veterinarios->sortByDesc('consultas_count')->first(),
            'media_consultas_por_vet' => $veterinarios->count() > 0
                ? round($veterinarios->sum('consultas_count') / $veterinarios->count(), 1)
                : 0
        ];

        return response()->json([
            'veterinarios' => $veterinarios,
            'stats' => $stats
        ]);
    }

    /**
     * Relatório de consultas
     */
    public function consultationReport(Request $request)
    {
        $query = Consulta::with(['animal.cliente', 'veterinario', 'procedures']);

        // Filtros opcionais
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->whereHas('animal', function($subQ) use ($request) {
                    $subQ->where('nome', 'like', "%{$request->search}%")
                         ->orWhereHas('cliente', function($clienteQ) use ($request) {
                             $clienteQ->where('nome', 'like', "%{$request->search}%");
                         });
                })->orWhere('motivo', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('data_from') && $request->data_from) {
            $query->whereDate('data_consulta', '>=', $request->data_from);
        }

        if ($request->has('data_to') && $request->data_to) {
            $query->whereDate('data_consulta', '<=', $request->data_to);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('veterinario_id') && $request->veterinario_id) {
            $query->where('veterinario_id', $request->veterinario_id);
        }

        $consultas = $query->orderBy('data_consulta', 'desc')->get();

        // Estatísticas das consultas
        $receita_total = DB::table('consulta_procedures')
                            ->join('procedures', 'consulta_procedures.procedure_id', '=', 'procedures.id')
                            ->sum(DB::raw('consulta_procedures.quantidade * consulta_procedures.valor_unitario'));

        $stats = [
            'total_consultas' => $consultas->count(),
            'consultas_concluidas' => Consulta::where('status', 'realizada')->count(),
            'receita_total' => $receita_total,
            'ticket_medio' => $consultas->count() > 0 ? round($receita_total / $consultas->count(), 2) : 0,
            'distribuicao_status' => Consulta::selectRaw('status as name, COUNT(*) as value')
                                             ->groupBy('status')
                                             ->get(),
            'consultas_por_veterinario' => Consulta::join('veterinarios', 'consultas.veterinario_id', '=', 'veterinarios.id')
                                                   ->selectRaw('veterinarios.nome, COUNT(*) as total')
                                                   ->groupBy('veterinarios.id', 'veterinarios.nome')
                                                   ->orderBy('total', 'desc')
                                                   ->get(),
            'evolucao_temporal' => Consulta::selectRaw('DATE(data_consulta) as data, COUNT(*) as consultas')
                                          ->whereDate('data_consulta', '>=', Carbon::now()->subDays(30))
                                          ->groupBy('data')
                                          ->orderBy('data')
                                          ->get()
                                          ->map(function($item) {
                                              $item->receita = DB::table('consulta_procedures')
                                                                ->join('consultas', 'consulta_procedures.consulta_id', '=', 'consultas.id')
                                                                ->whereDate('consultas.data_consulta', $item->data)
                                                                ->sum(DB::raw('consulta_procedures.quantidade * consulta_procedures.valor_unitario'));
                                              return $item;
                                          })
        ];

        return response()->json([
            'consultas' => $consultas,
            'stats' => $stats
        ]);
    }

    /**
     * Dados para gráficos do dashboard
     */
    public function dashboardCharts()
    {
        // Consultas por mês nos últimos 12 meses
        $consultasPorMes = [];
        for ($i = 11; $i >= 0; $i--) {
            $data = Carbon::now()->subMonths($i);
            $count = Consulta::whereMonth('data_consulta', $data->month)
                            ->whereYear('data_consulta', $data->year)
                            ->count();
            $consultasPorMes[] = [
                'mes' => $data->format('M/Y'),
                'total' => $count
            ];
        }

        // Receita por mês nos últimos 12 meses
        $receitaPorMes = [];
        for ($i = 11; $i >= 0; $i--) {
            $data = Carbon::now()->subMonths($i);
            $receita = Consulta::whereMonth('data_consulta', $data->month)
                              ->whereYear('data_consulta', $data->year)
                              ->sum('valor');
            $receitaPorMes[] = [
                'mes' => $data->format('M/Y'),
                'receita' => $receita ?: 0
            ];
        }

        // Animais por espécie
        $animaisPorEspecie = Animal::selectRaw('especie, COUNT(*) as total')
                                  ->groupBy('especie')
                                  ->orderBy('total', 'desc')
                                  ->get();

        return response()->json([
            'consultas_por_mes' => $consultasPorMes,
            'receita_por_mes' => $receitaPorMes,
            'animais_por_especie' => $animaisPorEspecie
        ]);
    }
}

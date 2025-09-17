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
     * Retorna a expressão SQL correta para extrair mês baseada no driver de banco
     */
    private function getMonthSelect($column)
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'sqlite') {
            return "CAST(strftime('%m', {$column}) AS INTEGER)";
        } else {
            return "MONTH({$column})";
        }
    }

    /**
     * Retorna dados de dashboard com estatísticas resumidas
     */
    public function dashboard()
    {
        // Cache por 10 minutos
        $stats = cache()->remember('reports.dashboard', 600, function () {
            return [
                'total_clientes' => Cliente::count(),
                'total_animais' => Animal::count(),
                'total_veterinarios' => Veterinario::count(),
                'total_consultas' => Consulta::count(),
                'consultas_mes_atual' => Consulta::whereMonth('data_consulta', Carbon::now()->month)
                                               ->whereYear('data_consulta', Carbon::now()->year)
                                               ->count(),
                'receita_mes_atual' => DB::table('consulta_procedures')
                                        ->join('consultas', 'consulta_procedures.consulta_id', '=', 'consultas.id')
                                        ->whereMonth('consultas.data_consulta', Carbon::now()->month)
                                        ->whereYear('consultas.data_consulta', Carbon::now()->year)
                                        ->sum(DB::raw('consulta_procedures.quantidade * consulta_procedures.valor_unitario')),
                'consultas_pendentes' => Consulta::where('status', 'agendada')->count(),
                'procedures_mais_realizados' => DB::table('consulta_procedures')
                                                ->join('procedures', 'consulta_procedures.procedure_id', '=', 'procedures.id')
                                                ->select('procedures.nome', 'procedures.categoria', DB::raw('SUM(consulta_procedures.quantidade) as total'))
                                                ->groupBy('procedures.id', 'procedures.nome', 'procedures.categoria')
                                                ->orderBy('total', 'DESC')
                                                ->limit(5)
                                                ->get()
            ];
        });

        return response()->json($stats);
    }

    /**
     * Retorna dados gerais para o dashboard de relatórios
     */
    public function index()
    {
        // Cache the dashboard stats for 10 minutes to reduce database load
        $stats = cache()->remember('dashboard_stats', 600, function () {
            return [
                'total_clientes' => Cliente::count(),
                'total_animais' => Animal::count(),
                'total_veterinarios' => Veterinario::count(),
                'total_consultas' => Consulta::count(),
                'total_procedures' => Procedure::count(),
                'consultas_mes_atual' => Consulta::whereMonth('data_consulta', Carbon::now()->month)
                                               ->whereYear('data_consulta', Carbon::now()->year)
                                               ->count(),
                'receita_mes_atual' => DB::table('consulta_procedures')
                                        ->join('consultas', 'consulta_procedures.consulta_id', '=', 'consultas.id')
                                        ->whereMonth('consultas.data_consulta', Carbon::now()->month)
                                        ->whereYear('consultas.data_consulta', Carbon::now()->year)
                                        ->sum(DB::raw('consulta_procedures.quantidade * consulta_procedures.valor_unitario')),
                'consultas_pendentes' => Consulta::where('status', 'agendada')->count(),
            ];
        });

        return response()->json($stats);
    }

    /**
     * Relatório de clientes
     */
    public function clientReport(Request $request)
    {
        $query = Cliente::with(['animals:id,cliente_id,nome,especie']);

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

        // Add pagination for better performance
        $perPage = $request->get('per_page', 50);
        $clientes = $query->orderBy('created_at', 'desc')
                         ->paginate($perPage);

        // Optimize statistics with direct SQL queries
        $stats = [
            'total_clientes' => Cliente::count(),
            'clientes_com_animais' => Cliente::whereHas('animals')->count(),
            'media_animais_por_cliente' => round(
                Animal::count() / max(Cliente::count(), 1), 2
            ),
            'clientes_por_mes' => Cliente::selectRaw($this->getMonthSelect('created_at') . ' as mes, COUNT(*) as total')
                                        ->whereYear('created_at', Carbon::now()->year)
                                        ->groupBy('mes')
                                        ->orderBy('mes')
                                        ->get()
        ];

        return response()->json([
            'overview' => [
                'total_clientes' => Cliente::count(),
                'clientes_ativos' => Cliente::whereHas('animals')->count(),
                'clientes_mes_atual' => Cliente::whereMonth('created_at', Carbon::now()->month)
                                              ->whereYear('created_at', Carbon::now()->year)
                                              ->count(),
                'media_animais_por_cliente' => round(
                    Animal::count() / max(Cliente::count(), 1), 2
                )
            ],
            'clients_by_month' => Cliente::selectRaw($this->getMonthSelect('created_at') . ' as mes, COUNT(*) as total')
                                        ->whereYear('created_at', Carbon::now()->year)
                                        ->groupBy('mes')
                                        ->orderBy('mes')
                                        ->get()
                                        ->map(function($item) {
                                            $item->mes = Carbon::create()->month($item->mes)->format('M');
                                            return $item;
                                        }),
            'clients_by_city' => Cliente::selectRaw('cidade as name, COUNT(*) as value')
                                       ->groupBy('cidade')
                                       ->orderBy('value', 'desc')
                                       ->limit(10)
                                       ->get(),
            'top_clients' => Cliente::withCount('animals')
                                   ->orderBy('animals_count', 'desc')
                                   ->limit(10)
                                   ->get(),
            'clients_list' => $clientes
        ]);
    }

    /**
     * Relatório de animais
     */
    public function petReport(Request $request)
    {
        $query = Animal::with(['cliente:id,nome', 'consultas:id,animal_id']);

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

        // Add pagination for better performance
        $perPage = $request->get('per_page', 50);
        $animals = $query->orderBy('created_at', 'desc')
                        ->paginate($perPage);

        // Optimize statistics calculations
        $stats = [
            'total_animals' => Animal::count(),
            'especies_diferentes' => Animal::distinct('especie')->count('especie'),
            'machos' => Animal::where('sexo', 'macho')->count(),
            'femeas' => Animal::where('sexo', 'femea')->count(),
            'distribuicao_especies' => Animal::selectRaw('especie as name, COUNT(*) as value')
                                          ->groupBy('especie')
                                          ->orderBy('value', 'desc')
                                          ->get(),
            'animais_por_mes' => Animal::selectRaw($this->getMonthSelect('created_at') . ' as mes, COUNT(*) as total')
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
            'overview' => [
                'total_animais' => Animal::count(),
                'animais_ativos' => Animal::count(), // todos considerados ativos
                'animais_mes_atual' => Animal::whereMonth('created_at', Carbon::now()->month)
                                             ->whereYear('created_at', Carbon::now()->year)
                                             ->count(),
                'media_idade' => round(
                    Animal::whereNotNull('data_nascimento')
                          ->get()
                          ->avg(function($animal) {
                              return Carbon::parse($animal->data_nascimento)->age;
                          }) ?? 0, 1
                )
            ],
            'pets_by_species' => Animal::selectRaw('especie as name, COUNT(*) as value')
                                       ->groupBy('especie')
                                       ->orderBy('value', 'desc')
                                       ->get(),
            'pets_by_age_group' => DB::table('animals')
                                     ->selectRaw('
                                       CASE
                                         WHEN (julianday("date") - julianday(data_nascimento)) < 365 THEN "Filhote (< 1 ano)"
                                         WHEN (julianday("date") - julianday(data_nascimento)) < 2555 THEN "Jovem (1-7 anos)"
                                         ELSE "Idoso (> 7 anos)"
                                       END as name,
                                       COUNT(*) as value
                                     ')
                                     ->whereNotNull('data_nascimento')
                                     ->groupBy('name')
                                     ->get(),
            'pets_by_month' => Animal::selectRaw($this->getMonthSelect('created_at') . ' as mes, COUNT(*) as total')
                                     ->whereYear('created_at', Carbon::now()->year)
                                     ->groupBy('mes')
                                     ->orderBy('mes')
                                     ->get()
                                     ->map(function($item) {
                                         $item->mes = Carbon::create()->month($item->mes)->format('M');
                                         return $item;
                                     }),
            'pets_list' => $animals
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

        // Add pagination for better performance
        $perPage = $request->get('per_page', 50);
        $procedures = $query->orderBy('consultas_count', 'desc')
                           ->paginate($perPage);

        // Optimize statistics with efficient queries
        $stats = [
            'total_procedures' => Procedure::count(),
            'procedures_ativos' => Procedure::where('ativo', true)->count(),
            'preco_medio' => round(Procedure::avg('preco') ?? 0, 2),
            'procedure_mais_usado' => Procedure::withCount('consultas')
                                              ->orderBy('consultas_count', 'desc')
                                              ->first(),
            'receita_total_procedures' => DB::table('consulta_procedures')
                                            ->sum(DB::raw('quantidade * valor_unitario')),
            'evolucao_mensal' => DB::table('consulta_procedures as cp')
                                   ->join('consultas as c', 'cp.consulta_id', '=', 'c.id')
                                   ->selectRaw($this->getMonthSelect('c.data_consulta') . ' as mes,
                                              COUNT(*) as aplicacoes,
                                              SUM(cp.quantidade * cp.valor_unitario) as receita')
                                   ->whereYear('c.data_consulta', Carbon::now()->year)
                                   ->groupBy('mes')
                                   ->orderBy('mes')
                                   ->get()
                                   ->map(function($item) {
                                       $item->mes = Carbon::create()->month($item->mes)->format('M');
                                       return $item;
                                   }),
            'distribuicao_precos' => Procedure::selectRaw('
                                       CASE
                                         WHEN preco < 50 THEN "Até R$ 50"
                                         WHEN preco < 100 THEN "R$ 50 - R$ 100"
                                         WHEN preco < 200 THEN "R$ 100 - R$ 200"
                                         ELSE "Acima de R$ 200"
                                       END as faixa,
                                       COUNT(*) as value
                                     ')
                                     ->groupBy('faixa')
                                     ->get()
                                     ->map(function($item) {
                                         return [
                                             'name' => $item->faixa,
                                             'value' => $item->value
                                         ];
                                     })
        ];

        return response()->json([
            'overview' => [
                'total_procedures' => Procedure::count(),
                'procedures_mes_atual' => DB::table('consulta_procedures as cp')
                                            ->join('consultas as c', 'cp.consulta_id', '=', 'c.id')
                                            ->whereMonth('c.data_consulta', Carbon::now()->month)
                                            ->whereYear('c.data_consulta', Carbon::now()->year)
                                            ->sum('cp.quantidade'),
                'receita_procedures' => DB::table('consulta_procedures')
                                          ->sum(DB::raw('quantidade * valor_unitario')),
                'preco_medio' => round(Procedure::avg('preco') ?? 0, 2)
            ],
            'procedures_by_category' => Procedure::selectRaw('categoria as name, COUNT(*) as value')
                                                 ->groupBy('categoria')
                                                 ->orderBy('value', 'desc')
                                                 ->get(),
            'top_procedures' => Procedure::withCount('consultas')
                                        ->orderBy('consultas_count', 'desc')
                                        ->limit(10)
                                        ->get(),
            'procedures_by_month' => DB::table('consulta_procedures as cp')
                                       ->join('consultas as c', 'cp.consulta_id', '=', 'c.id')
                                       ->selectRaw($this->getMonthSelect('c.data_consulta') . ' as mes, COUNT(*) as aplicacoes')
                                       ->whereYear('c.data_consulta', Carbon::now()->year)
                                       ->groupBy('mes')
                                       ->orderBy('mes')
                                       ->get()
                                       ->map(function($item) {
                                           $item->mes = Carbon::create()->month($item->mes)->format('M');
                                           return $item;
                                       }),
            'procedures_list' => $procedures
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

        // Add pagination for better performance
        $perPage = $request->get('per_page', 50);
        $veterinarios = $query->orderBy('consultas_count', 'desc')
                             ->paginate($perPage);

        // Optimize statistics calculations
        $totalVeterinarios = Veterinario::count();
        $totalConsultas = DB::table('consultas')->count();

        $stats = [
            'total_veterinarios' => $totalVeterinarios,
            'especialidades' => Veterinario::selectRaw('especialidade as name, COUNT(*) as value')
                                          ->groupBy('especialidade')
                                          ->orderBy('value', 'desc')
                                          ->get(),
            'veterinario_mais_ativo' => Veterinario::withCount('consultas')
                                                  ->orderBy('consultas_count', 'desc')
                                                  ->first(),
            'media_consultas_por_vet' => $totalVeterinarios > 0
                ? round($totalConsultas / $totalVeterinarios, 1)
                : 0,
            'consultas_por_mes' => DB::table('consultas as c')
                                     ->join('veterinarios as v', 'c.veterinario_id', '=', 'v.id')
                                     ->selectRaw($this->getMonthSelect('c.data_consulta') . ' as mes, COUNT(*) as total')
                                     ->whereYear('c.data_consulta', Carbon::now()->year)
                                     ->groupBy('mes')
                                     ->orderBy('mes')
                                     ->get()
                                     ->map(function($item) {
                                         $item->mes = Carbon::create()->month($item->mes)->format('M');
                                         return $item;
                                     })
        ];

        return response()->json([
            'overview' => [
                'total_veterinarios' => $totalVeterinarios,
                'veterinarios_ativos' => Veterinario::count(), // todos são considerados ativos no momento
                'consultas_total' => $totalConsultas,
                'receita_total' => DB::table('consulta_procedures')
                                    ->join('consultas', 'consulta_procedures.consulta_id', '=', 'consultas.id')
                                    ->join('veterinarios', 'consultas.veterinario_id', '=', 'veterinarios.id')
                                    ->sum(DB::raw('consulta_procedures.quantidade * consulta_procedures.valor_unitario'))
            ],
            'vets_by_specialization' => Veterinario::selectRaw('especialidade as name, COUNT(*) as value')
                                          ->groupBy('especialidade')
                                          ->orderBy('value', 'desc')
                                          ->get(),
            'top_vets_by_consultations' => Veterinario::withCount('consultas')
                                                     ->orderBy('consultas_count', 'desc')
                                                     ->limit(10)
                                                     ->get(),
            'vets_by_revenue' => DB::table('veterinarios as v')
                                   ->leftJoin('consultas as c', 'v.id', '=', 'c.veterinario_id')
                                   ->leftJoin('consulta_procedures as cp', 'c.id', '=', 'cp.consulta_id')
                                   ->selectRaw('v.nome, COALESCE(SUM(cp.quantidade * cp.valor_unitario), 0) as receita')
                                   ->groupBy('v.id', 'v.nome')
                                   ->orderBy('receita', 'desc')
                                   ->limit(10)
                                   ->get(),
            'vets_list' => $veterinarios
        ]);
    }

    /**
     * Relatório de consultas
     */
    public function consultationReport(Request $request)
    {
        $query = Consulta::with([
            'animal:id,nome,cliente_id',
            'animal.cliente:id,nome',
            'veterinario:id,nome',
            'procedures:id,nome,preco'
        ]);

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

        // Add pagination for better performance
        $perPage = $request->get('per_page', 50);
        $consultas = $query->orderBy('data_consulta', 'desc')
                          ->paginate($perPage);

        // Optimize statistics with single queries
        $receita_total = DB::table('consulta_procedures')
                            ->sum(DB::raw('quantidade * valor_unitario'));

        $totalConsultas = Consulta::count();

        $stats = [
            'total_consultas' => $totalConsultas,
            'consultas_concluidas' => Consulta::where('status', 'realizada')->count(),
            'receita_total' => $receita_total,
            'ticket_medio' => $totalConsultas > 0 ? round($receita_total / $totalConsultas, 2) : 0,
            'distribuicao_status' => Consulta::selectRaw('status as name, COUNT(*) as value')
                                             ->groupBy('status')
                                             ->get(),
            'consultas_por_veterinario' => Consulta::join('veterinarios', 'consultas.veterinario_id', '=', 'veterinarios.id')
                                                   ->selectRaw('veterinarios.nome, COUNT(*) as total')
                                                   ->groupBy('veterinarios.id', 'veterinarios.nome')
                                                   ->orderBy('total', 'desc')
                                                   ->get(),
            'evolucao_temporal' => DB::table('consultas as c')
                                     ->leftJoin('consulta_procedures as cp', 'c.id', '=', 'cp.consulta_id')
                                     ->selectRaw('DATE(c.data_consulta) as data,
                                                COUNT(DISTINCT c.id) as consultas,
                                                COALESCE(SUM(cp.quantidade * cp.valor_unitario), 0) as receita')
                                     ->whereDate('c.data_consulta', '>=', Carbon::now()->subDays(30))
                                     ->groupBy('data')
                                     ->orderBy('data')
                                     ->get()
        ];

        return response()->json([
            'overview' => [
                'total_consultas' => $totalConsultas,
                'consultas_mes_atual' => Consulta::whereMonth('data_consulta', Carbon::now()->month)
                                                 ->whereYear('data_consulta', Carbon::now()->year)
                                                 ->count(),
                'receita_total' => $receita_total,
                'ticket_medio' => $totalConsultas > 0 ? round($receita_total / $totalConsultas, 2) : 0
            ],
            'consultations_by_month' => DB::table('consultas as c')
                                          ->selectRaw($this->getMonthSelect('c.data_consulta') . ' as mes, COUNT(*) as total')
                                          ->whereYear('c.data_consulta', Carbon::now()->year)
                                          ->groupBy('mes')
                                          ->orderBy('mes')
                                          ->get()
                                          ->map(function($item) {
                                              $item->mes = Carbon::create()->month($item->mes)->format('M');
                                              return $item;
                                          }),
            'consultations_by_status' => Consulta::selectRaw('status as name, COUNT(*) as value')
                                                 ->groupBy('status')
                                                 ->get(),
            'revenue_by_month' => DB::table('consulta_procedures as cp')
                                    ->join('consultas as c', 'cp.consulta_id', '=', 'c.id')
                                    ->selectRaw($this->getMonthSelect('c.data_consulta') . ' as mes, SUM(cp.quantidade * cp.valor_unitario) as receita')
                                    ->whereYear('c.data_consulta', Carbon::now()->year)
                                    ->groupBy('mes')
                                    ->orderBy('mes')
                                    ->get()
                                    ->map(function($item) {
                                        $item->mes = Carbon::create()->month($item->mes)->format('M');
                                        return $item;
                                    }),
            'consultations_by_vet' => Consulta::join('veterinarios', 'consultas.veterinario_id', '=', 'veterinarios.id')
                                              ->selectRaw('veterinarios.nome as name, COUNT(*) as value')
                                              ->groupBy('veterinarios.id', 'veterinarios.nome')
                                              ->orderBy('value', 'desc')
                                              ->limit(10)
                                              ->get(),
            'consultations_list' => $consultas
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

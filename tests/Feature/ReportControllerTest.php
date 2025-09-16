<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Consulta;
use App\Models\Procedure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $clientes;
    protected $veterinarios;
    protected $procedures;
    protected $animais;
    protected $consultas;

    protected function setUp(): void
    {
        parent::setUp();

        // Criar usuário para autenticação
        $this->user = User::factory()->create();

        // Criar dados de teste
        $this->createTestData();
    }

    private function createTestData()
    {
        // Criar clientes
        $this->clientes = Cliente::factory(5)->create();

        // Criar veterinários
        $this->veterinarios = Veterinario::factory(3)->create();

        // Criar procedures
        $this->procedures = Procedure::factory(10)->create();

        // Criar animais
        $this->animais = collect();
        $this->clientes->each(function ($cliente) {
            $animais = Animal::factory(2)->create(['cliente_id' => $cliente->id]);
            $this->animais = $this->animais->merge($animais);
        });

        // Criar consultas
        $this->consultas = collect();
        $this->animais->each(function ($animal) {
            $consulta = Consulta::factory()->create([
                'animal_id' => $animal->id,
                'veterinario_id' => $this->veterinarios->random()->id,
                'data_consulta' => now()->subDays(rand(1, 30)),
                'valor_total' => rand(100, 500)
            ]);

            // Adicionar procedures às consultas
            $procedures = $this->procedures->random(rand(1, 3));
            $consulta->procedures()->attach($procedures->pluck('id'));

            $this->consultas->push($consulta);
        });
    }

    public function test_dashboard_returns_correct_statistics()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/dashboard');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'total_clientes',
                    'total_animais',
                    'total_veterinarios',
                    'total_consultas',
                    'consultas_mes_atual',
                    'receita_mes_atual',
                    'consultas_pendentes',
                    'procedures_mais_realizados'
                ]);

        $data = $response->json();

        $this->assertEquals($this->clientes->count(), $data['total_clientes']);
        $this->assertEquals($this->animais->count(), $data['total_animais']);
        $this->assertEquals($this->veterinarios->count(), $data['total_veterinarios']);
        $this->assertEquals($this->consultas->count(), $data['total_consultas']);
    }

    public function test_clients_report_returns_correct_data()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/clients');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'overview' => [
                        'total_clientes',
                        'clientes_ativos',
                        'clientes_mes_atual',
                        'media_animais_por_cliente'
                    ],
                    'clients_by_month',
                    'clients_by_city',
                    'top_clients',
                    'clients_list' => [
                        'data',
                        'total',
                        'per_page',
                        'current_page'
                    ]
                ]);
    }

    public function test_clients_report_with_filters()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/clients?' . http_build_query([
            'search' => 'test',
            'city' => 'São Paulo',
            'start_date' => now()->subMonth()->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
            'per_page' => 5
        ]));

        $response->assertStatus(200);
    }

    public function test_pets_report_returns_correct_data()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/pets');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'overview' => [
                        'total_animais',
                        'animais_ativos',
                        'animais_mes_atual',
                        'media_idade'
                    ],
                    'pets_by_species',
                    'pets_by_age_group',
                    'pets_by_month',
                    'pets_list'
                ]);
    }

    public function test_procedures_report_returns_correct_data()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/procedures');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'overview' => [
                        'total_procedures',
                        'procedures_mes_atual',
                        'receita_procedures',
                        'preco_medio'
                    ],
                    'procedures_by_category',
                    'top_procedures',
                    'procedures_by_month',
                    'procedures_list'
                ]);
    }

    public function test_veterinarians_report_returns_correct_data()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/veterinarians');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'overview' => [
                        'total_veterinarios',
                        'veterinarios_ativos',
                        'consultas_total',
                        'receita_total'
                    ],
                    'vets_by_specialization',
                    'top_vets_by_consultations',
                    'vets_by_revenue',
                    'vets_list'
                ]);
    }

    public function test_consultations_report_returns_correct_data()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/consultations');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'overview' => [
                        'total_consultas',
                        'consultas_mes_atual',
                        'receita_total',
                        'ticket_medio'
                    ],
                    'consultations_by_month',
                    'consultations_by_status',
                    'revenue_by_month',
                    'consultations_by_vet',
                    'consultations_list'
                ]);
    }

    public function test_unauthenticated_access_returns_401()
    {
        $response = $this->get('/api/reports/dashboard');
        $response->assertStatus(401);
    }

    public function test_reports_are_cached()
    {
        // Primeira requisição
        $response1 = $this->actingAs($this->user)->get('/api/reports/dashboard');
        $response1->assertStatus(200);

        // Verificar se o cache foi criado
        $this->assertTrue(cache()->has('reports.dashboard'));

        // Segunda requisição deve usar cache
        $response2 = $this->actingAs($this->user)->get('/api/reports/dashboard');
        $response2->assertStatus(200);

        // Os dados devem ser iguais
        $this->assertEquals($response1->json(), $response2->json());
    }

    public function test_consultations_report_with_date_filters()
    {
        $startDate = now()->subMonth()->format('Y-m-d');
        $endDate = now()->format('Y-m-d');

        $response = $this->actingAs($this->user)->get('/api/reports/consultations?' . http_build_query([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'veterinario_id' => $this->veterinarios->first()->id,
            'status' => 'realizada'
        ]));

        $response->assertStatus(200);
    }

    public function test_procedures_report_with_category_filter()
    {
        $response = $this->actingAs($this->user)->get('/api/reports/procedures?' . http_build_query([
            'category' => 'Cirurgia',
            'min_price' => 100,
            'max_price' => 500
        ]));

        $response->assertStatus(200);
    }
}

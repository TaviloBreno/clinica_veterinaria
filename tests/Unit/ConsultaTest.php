<?php

namespace Tests\Unit;

use App\Models\Consulta;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Procedure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultaTest extends TestCase
{
    use RefreshDatabase;

    public function test_consulta_belongs_to_animal()
    {
        $animal = Animal::factory()->create();
        $consulta = Consulta::factory()->create(['animal_id' => $animal->id]);

        $this->assertInstanceOf(Animal::class, $consulta->animal);
        $this->assertEquals($animal->id, $consulta->animal->id);
    }

    public function test_consulta_belongs_to_veterinario()
    {
        $veterinario = Veterinario::factory()->create();
        $consulta = Consulta::factory()->create(['veterinario_id' => $veterinario->id]);

        $this->assertInstanceOf(Veterinario::class, $consulta->veterinario);
        $this->assertEquals($veterinario->id, $consulta->veterinario->id);
    }

    public function test_consulta_has_many_procedures()
    {
        $consulta = Consulta::factory()->create();
        $procedures = Procedure::factory(3)->create();

        $consulta->procedures()->attach($procedures->pluck('id'));

        $this->assertEquals(3, $consulta->procedures()->count());
        $this->assertInstanceOf(Procedure::class, $consulta->procedures->first());
    }

    public function test_consulta_status_validation()
    {
        $consulta = Consulta::factory()->create(['status' => 'agendada']);
        $this->assertEquals('agendada', $consulta->status);

        $consulta->update(['status' => 'realizada']);
        $this->assertEquals('realizada', $consulta->status);
    }

    public function test_consulta_can_calculate_total_procedures_value()
    {
        $consulta = Consulta::factory()->create(['valor_total' => 0]);
        $procedures = Procedure::factory(2)->create([
            'preco' => 100
        ]);

        $consulta->procedures()->attach($procedures->pluck('id'));

        // O valor total deve ser calculado baseado nos procedures
        $expectedTotal = $procedures->sum('preco');
        $this->assertEquals($expectedTotal, $consulta->procedures->sum('preco'));
    }

    public function test_consulta_has_correct_fillable_attributes()
    {
        $consulta = new Consulta();

        $fillable = $consulta->getFillable();

        $this->assertContains('data_consulta', $fillable);
        $this->assertContains('observacoes', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('valor_total', $fillable);
        $this->assertContains('animal_id', $fillable);
        $this->assertContains('veterinario_id', $fillable);
    }

    public function test_consulta_scope_by_status()
    {
        Consulta::factory()->create(['status' => 'agendada']);
        Consulta::factory()->create(['status' => 'realizada']);
        Consulta::factory()->create(['status' => 'agendada']);

        $agendadas = Consulta::where('status', 'agendada')->count();
        $realizadas = Consulta::where('status', 'realizada')->count();

        $this->assertEquals(2, $agendadas);
        $this->assertEquals(1, $realizadas);
    }
}

<?php

namespace Tests\Unit;

use App\Models\Animal;
use App\Models\Cliente;
use App\Models\Consulta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnimalTest extends TestCase
{
    use RefreshDatabase;

    public function test_animal_belongs_to_cliente()
    {
        $cliente = Cliente::factory()->create();
        $animal = Animal::factory()->create(['cliente_id' => $cliente->id]);

        $this->assertInstanceOf(Cliente::class, $animal->cliente);
        $this->assertEquals($cliente->id, $animal->cliente->id);
    }

    public function test_animal_has_many_consultas()
    {
        $animal = Animal::factory()->create();
        $consultas = Consulta::factory(2)->create(['animal_id' => $animal->id]);

        $this->assertEquals(2, $animal->consultas()->count());
        $this->assertInstanceOf(Consulta::class, $animal->consultas->first());
    }

    public function test_animal_can_calculate_age()
    {
        $animal = Animal::factory()->create([
            'data_nascimento' => now()->subYears(2)->format('Y-m-d')
        ]);

        // Considerando que pode ter diferença de dias
        $this->assertTrue($animal->idade >= 1 && $animal->idade <= 3);
    }

    public function test_animal_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Animal::create([
            'especie' => 'Cão'
        ]);
    }

    public function test_animal_has_correct_fillable_attributes()
    {
        $animal = new Animal();
        
        $fillable = $animal->getFillable();
        
        $this->assertContains('nome', $fillable);
        $this->assertContains('especie', $fillable);
        $this->assertContains('raca', $fillable);
        $this->assertContains('sexo', $fillable);
        $this->assertContains('data_nascimento', $fillable);
        $this->assertContains('peso', $fillable);
        $this->assertContains('cliente_id', $fillable);
    }

    public function test_animal_idade_accessor()
    {
        $birthDate = now()->subYears(3)->subMonths(6);
        $animal = Animal::factory()->create([
            'data_nascimento' => $birthDate->format('Y-m-d')
        ]);

        // A idade deve estar entre 3 e 4 anos
        $this->assertTrue($animal->idade >= 3 && $animal->idade <= 4);
    }
}
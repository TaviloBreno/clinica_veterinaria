<?php

namespace Tests\Unit;

use App\Models\Cliente;
use App\Models\Animal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteTest extends TestCase
{
    use RefreshDatabase;

    public function test_cliente_can_be_created()
    {
        $cliente = Cliente::factory()->create([
            'nome' => 'João Silva',
            'email' => 'joao@example.com',
            'telefone' => '(11) 99999-9999'
        ]);

        $this->assertDatabaseHas('clientes', [
            'nome' => 'João Silva',
            'email' => 'joao@example.com',
            'telefone' => '(11) 99999-9999'
        ]);
    }

    public function test_cliente_has_many_animals()
    {
        $cliente = Cliente::factory()->create();
        $animals = Animal::factory(3)->create(['cliente_id' => $cliente->id]);

        $this->assertEquals(3, $cliente->animais()->count());
        $this->assertInstanceOf(Animal::class, $cliente->animais->first());
    }

    public function test_cliente_name_is_required()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Cliente::create([
            'email' => 'test@example.com',
            'telefone' => '123456789'
        ]);
    }

    public function test_cliente_email_must_be_unique()
    {
        Cliente::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Cliente::factory()->create(['email' => 'test@example.com']);
    }

    public function test_cliente_has_correct_fillable_attributes()
    {
        $cliente = new Cliente();

        $fillable = $cliente->getFillable();

        $this->assertContains('nome', $fillable);
        $this->assertContains('telefone', $fillable);
        $this->assertContains('email', $fillable);
        $this->assertContains('endereco', $fillable);
        $this->assertContains('cidade', $fillable);
    }
}

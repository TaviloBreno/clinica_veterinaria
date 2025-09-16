<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->name,
            'telefone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'cpf' => $this->faker->unique()->numerify('###########'),
            'endereco' => $this->faker->address,
            'cidade' => $this->faker->city,
            'estado' => $this->faker->stateAbbr,
            'cep' => $this->faker->numerify('########'),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}

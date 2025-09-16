<?php

namespace Database\Factories;

use App\Models\Consulta;
use App\Models\Animal;
use App\Models\Veterinario;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultaFactory extends Factory
{
    protected $model = Consulta::class;

    public function definition()
    {
        $status = ['agendada', 'realizada', 'cancelada'];

        return [
            'data_consulta' => $this->faker->dateTimeBetween('-6 months', '+1 month'),
            'motivo' => $this->faker->sentence,
            'observacoes' => $this->faker->paragraph,
            'status' => $this->faker->randomElement($status),
            'valor' => $this->faker->randomFloat(2, 50, 500),
            'animal_id' => Animal::factory(),
            'veterinario_id' => Veterinario::factory(),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }
}

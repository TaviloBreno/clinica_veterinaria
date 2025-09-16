<?php

namespace Database\Factories;

use App\Models\Veterinario;
use Illuminate\Database\Eloquent\Factories\Factory;

class VeterinarioFactory extends Factory
{
    protected $model = Veterinario::class;

    public function definition()
    {
        $especializacoes = ['Clínica Geral', 'Cirurgia', 'Dermatologia', 'Cardiologia', 'Oftalmologia', 'Ortopedia'];

        return [
            'nome' => $this->faker->name,
            'telefone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
                        'especialidade' => $this->faker->randomElement($especializacoes),
            'crmv' => 'CRMV-' . $this->faker->unique()->randomNumber(5),
            'observacoes' => $this->faker->sentence,
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => now(),
        ];
    }
}

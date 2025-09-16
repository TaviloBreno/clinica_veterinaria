<?php

namespace Database\Factories;

use App\Models\Animal;
use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition()
    {
        $especies = ['Cão', 'Gato', 'Pássaro', 'Coelho', 'Hamster'];
        $sexos = ['Macho', 'Fêmea'];
        
        return [
            'nome' => $this->faker->firstName,
            'especie' => $this->faker->randomElement($especies),
            'raca' => $this->faker->word,
            'sexo' => $this->faker->randomElement($sexos),
            'data_nascimento' => $this->faker->dateTimeBetween('-10 years', '-1 month'),
            'peso' => $this->faker->randomFloat(2, 0.5, 50),
            'observacoes' => $this->faker->sentence,
            'cliente_id' => Cliente::factory(),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
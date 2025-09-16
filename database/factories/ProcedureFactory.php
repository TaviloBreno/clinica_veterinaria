<?php

namespace Database\Factories;

use App\Models\Procedure;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProcedureFactory extends Factory
{
    protected $model = Procedure::class;

    public function definition()
    {
        $categorias = ['Cirurgia', 'Exame', 'Vacinação', 'Consulta', 'Tratamento'];
        $procedimentos = [
            'Consulta de rotina',
            'Vacinação antirrábica',
            'Castração',
            'Exame de sangue',
            'Raio-X',
            'Ultrassom',
            'Cirurgia ortopédica',
            'Tratamento dermatológico',
            'Limpeza dentária',
            'Medicação'
        ];

        return [
            'nome' => $this->faker->randomElement($procedimentos),
            'categoria' => $this->faker->randomElement($categorias),
            'preco' => $this->faker->randomFloat(2, 30, 800),
            'descricao' => $this->faker->sentence,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}

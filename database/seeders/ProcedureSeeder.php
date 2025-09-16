<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProcedureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $procedures = [
            [
                'nome' => 'Consulta Clínica Geral',
                'descricao' => 'Consulta veterinária básica para avaliação geral do animal',
                'preco' => 80.00,
                'duracao_minutos' => 30,
                'categoria' => 'consulta',
                'ativo' => true
            ],
            [
                'nome' => 'Vacinação V8',
                'descricao' => 'Vacina óctupla para prevenção de doenças em cães',
                'preco' => 45.00,
                'duracao_minutos' => 15,
                'categoria' => 'vacinacao',
                'ativo' => true
            ],
            [
                'nome' => 'Vacinação V4',
                'descricao' => 'Vacina quádrupla para prevenção de doenças em gatos',
                'preco' => 40.00,
                'duracao_minutos' => 15,
                'categoria' => 'vacinacao',
                'ativo' => true
            ],
            [
                'nome' => 'Castração Felina',
                'descricao' => 'Procedimento cirúrgico de esterilização em gatos',
                'preco' => 250.00,
                'duracao_minutos' => 90,
                'categoria' => 'cirurgia',
                'ativo' => true
            ],
            [
                'nome' => 'Castração Canina',
                'descricao' => 'Procedimento cirúrgico de esterilização em cães',
                'preco' => 350.00,
                'duracao_minutos' => 120,
                'categoria' => 'cirurgia',
                'ativo' => true
            ],
            [
                'nome' => 'Exame de Sangue Completo',
                'descricao' => 'Hemograma completo para diagnóstico',
                'preco' => 65.00,
                'duracao_minutos' => 20,
                'categoria' => 'exame',
                'ativo' => true
            ],
            [
                'nome' => 'Ultrassom Abdominal',
                'descricao' => 'Exame de imagem para avaliação de órgãos internos',
                'preco' => 120.00,
                'duracao_minutos' => 45,
                'categoria' => 'exame',
                'ativo' => true
            ],
            [
                'nome' => 'Limpeza Dentária',
                'descricao' => 'Procedimento de higiene oral sob anestesia',
                'preco' => 180.00,
                'duracao_minutos' => 60,
                'categoria' => 'procedimento',
                'ativo' => true
            ],
            [
                'nome' => 'Atendimento de Emergência',
                'descricao' => 'Atendimento urgente para casos críticos',
                'preco' => 150.00,
                'duracao_minutos' => 60,
                'categoria' => 'emergencia',
                'ativo' => true
            ],
            [
                'nome' => 'Consulta Dermatológica',
                'descricao' => 'Consulta especializada em problemas de pele',
                'preco' => 120.00,
                'duracao_minutos' => 45,
                'categoria' => 'consulta',
                'ativo' => true
            ]
        ];

        foreach ($procedures as $procedure) {
            \App\Models\Procedure::create($procedure);
        }
    }
}

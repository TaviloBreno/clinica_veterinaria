<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Consulta;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Criar clientes de teste
        $clientes = [
            [
                'nome' => 'João Silva',
                'email' => 'joao.silva@email.com',
                'telefone' => '11987654321',
                'cpf' => '12345678901',
                'endereco' => 'Rua das Flores, 123 - Jardim das Flores',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234567'
            ],
            [
                'nome' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'telefone' => '11976543210',
                'cpf' => '98765432109',
                'endereco' => 'Avenida Principal, 456 - Centro',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234568'
            ],
            [
                'nome' => 'Pedro Oliveira',
                'email' => 'pedro.oliveira@email.com',
                'telefone' => '11965432109',
                'cpf' => '45678912345',
                'endereco' => 'Rua do Comércio, 789 - Vila Comercial',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234569'
            ],
            [
                'nome' => 'Ana Costa',
                'email' => 'ana.costa@email.com',
                'telefone' => '11954321098',
                'cpf' => '78912345678',
                'endereco' => 'Praça Central, 101 - Centro',
                'cidade' => 'Guarulhos',
                'estado' => 'SP',
                'cep' => '07012345'
            ],
            [
                'nome' => 'Carlos Ferreira',
                'email' => 'carlos.ferreira@email.com',
                'telefone' => '11943210987',
                'cpf' => '32165498732',
                'endereco' => 'Rua da Alegria, 555 - Vila Nova',
                'cidade' => 'Osasco',
                'estado' => 'SP',
                'cep' => '06123456'
            ]
        ];

        foreach ($clientes as $clienteData) {
            Cliente::create($clienteData);
        }

        // Criar veterinários de teste
        $veterinarios = [
            [
                'nome' => 'Dr. Roberto Lima',
                'email' => 'roberto.lima@clinica.com',
                'telefone' => '11987123456',
                'crmv' => 'SP-12345',
                'especialidade' => 'Clínica Geral',
                'observacoes' => 'Especialista em pequenos animais'
            ],
            [
                'nome' => 'Dra. Fernanda Alves',
                'email' => 'fernanda.alves@clinica.com',
                'telefone' => '11987123457',
                'crmv' => 'SP-54321',
                'especialidade' => 'Cirurgia',
                'observacoes' => 'Cirurgias gerais e especializadas'
            ],
            [
                'nome' => 'Dr. Lucas Moreira',
                'email' => 'lucas.moreira@clinica.com',
                'telefone' => '11987123458',
                'crmv' => 'SP-98765',
                'especialidade' => 'Dermatologia',
                'observacoes' => 'Tratamento de doenças de pele'
            ]
        ];

        foreach ($veterinarios as $veterinarioData) {
            Veterinario::create($veterinarioData);
        }

        // Criar animais de teste
        $animais = [
            [
                'nome' => 'Max',
                'especie' => 'Cão',
                'raca' => 'Labrador',
                'sexo' => 'Macho',
                'cliente_id' => 1
            ],
            [
                'nome' => 'Mimi',
                'especie' => 'Gato',
                'raca' => 'Persa',
                'sexo' => 'Fêmea',
                'cliente_id' => 1
            ],
            [
                'nome' => 'Rex',
                'especie' => 'Cão',
                'raca' => 'Pastor Alemão',
                'sexo' => 'Macho',
                'cliente_id' => 2
            ],
            [
                'nome' => 'Luna',
                'especie' => 'Gato',
                'raca' => 'Siamês',
                'sexo' => 'Fêmea',
                'cliente_id' => 3
            ],
            [
                'nome' => 'Bob',
                'especie' => 'Cão',
                'raca' => 'Bulldog',
                'sexo' => 'Macho',
                'cliente_id' => 4
            ]
        ];

        foreach ($animais as $animalData) {
            Animal::create($animalData);
        }

        // Criar consultas de teste
        $consultas = [
            [
                'animal_id' => 1,
                'veterinario_id' => 1,
                'data_consulta' => '2024-12-01 10:00:00',
                'motivo' => 'Consulta de rotina',
                'diagnostico' => 'Animal saudável'
            ],
            [
                'animal_id' => 2,
                'veterinario_id' => 2,
                'data_consulta' => '2024-12-02 14:30:00',
                'motivo' => 'Vacinação',
                'diagnostico' => 'Vacinação realizada com sucesso'
            ],
            [
                'animal_id' => 3,
                'veterinario_id' => 1,
                'data_consulta' => '2024-12-03 09:15:00',
                'motivo' => 'Problemas dermatológicos',
                'diagnostico' => 'Dermatite alérgica'
            ]
        ];

        foreach ($consultas as $consultaData) {
            Consulta::create($consultaData);
        }

        $this->command->info('Dados de teste criados com sucesso!');
    }
}

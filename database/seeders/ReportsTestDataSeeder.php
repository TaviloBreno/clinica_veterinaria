<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\Animal;
use App\Models\Veterinario;
use App\Models\Consulta;
use App\Models\Procedure;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsTestDataSeeder extends Seeder
{
    public function run()
    {
        // Limpar dados existentes (opcional)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Consulta::query()->delete();
        Animal::query()->delete();
        Cliente::query()->delete();
        Veterinario::query()->delete();
        Procedure::query()->delete();
        DB::table('consulta_procedures')->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Criar procedimentos
        $procedures = [
            ['nome' => 'Consulta de Rotina', 'descricao' => 'Consulta veterinária básica', 'preco' => 80.00],
            ['nome' => 'Vacinação', 'descricao' => 'Aplicação de vacinas', 'preco' => 50.00],
            ['nome' => 'Castração', 'descricao' => 'Cirurgia de castração', 'preco' => 300.00],
            ['nome' => 'Limpeza Dental', 'descricao' => 'Procedimento de higiene dental', 'preco' => 150.00],
            ['nome' => 'Exame de Sangue', 'descricao' => 'Coleta e análise de sangue', 'preco' => 120.00],
            ['nome' => 'Raio-X', 'descricao' => 'Exame radiográfico', 'preco' => 100.00],
            ['nome' => 'Cirurgia de Emergência', 'descricao' => 'Procedimento cirúrgico de urgência', 'preco' => 500.00],
            ['nome' => 'Banho e Tosa', 'descricao' => 'Serviço de higienização e corte', 'preco' => 40.00],
            ['nome' => 'Desverminação', 'descricao' => 'Tratamento antiparasitário', 'preco' => 60.00],
            ['nome' => 'Ultrassom', 'descricao' => 'Exame ultrassonográfico', 'preco' => 180.00]
        ];

        foreach ($procedures as $proc) {
            Procedure::create($proc);
        }

        // Criar veterinários
        $veterinarios = [
            [
                'nome' => 'Dr. Carlos Silva',
                'email' => 'carlos@veterinaria.com',
                'telefone' => '(11) 99999-1111',
                'crmv' => 'SP-12345',
                'especialidade' => 'Clínica Geral'
            ],
            [
                'nome' => 'Dra. Ana Santos',
                'email' => 'ana@veterinaria.com',
                'telefone' => '(11) 99999-2222',
                'crmv' => 'SP-12346',
                'especialidade' => 'Cirurgia'
            ],
            [
                'nome' => 'Dr. Pedro Lima',
                'email' => 'pedro@veterinaria.com',
                'telefone' => '(11) 99999-3333',
                'crmv' => 'SP-12347',
                'especialidade' => 'Dermatologia'
            ],
            [
                'nome' => 'Dra. Maria Costa',
                'email' => 'maria@veterinaria.com',
                'telefone' => '(11) 99999-4444',
                'crmv' => 'SP-12348',
                'especialidade' => 'Cardiologia'
            ],
            [
                'nome' => 'Dr. João Oliveira',
                'email' => 'joao@veterinaria.com',
                'telefone' => '(11) 99999-5555',
                'crmv' => 'SP-12349',
                'especialidade' => 'Ortopedia'
            ]
        ];

        foreach ($veterinarios as $vet) {
            Veterinario::create($vet);
        }

        // Criar clientes
        $clientes = [
            [
                'nome' => 'João Silva',
                'email' => 'joao.silva@email.com',
                'telefone' => '(11) 98888-1111',
                'cpf' => '12345678901',
                'endereco' => 'Rua das Flores, 123',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234567'
            ],
            [
                'nome' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'telefone' => '(11) 98888-2222',
                'cpf' => '12345678902',
                'endereco' => 'Av. Paulista, 456',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234568'
            ],
            [
                'nome' => 'Pedro Costa',
                'email' => 'pedro.costa@email.com',
                'telefone' => '(11) 98888-3333',
                'cpf' => '12345678903',
                'endereco' => 'Rua Augusta, 789',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234569'
            ],
            [
                'nome' => 'Ana Lima',
                'email' => 'ana.lima@email.com',
                'telefone' => '(11) 98888-4444',
                'cpf' => '12345678904',
                'endereco' => 'Rua Oscar Freire, 321',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234570'
            ],
            [
                'nome' => 'Carlos Oliveira',
                'email' => 'carlos.oliveira@email.com',
                'telefone' => '(11) 98888-5555',
                'cpf' => '12345678905',
                'endereco' => 'Av. Faria Lima, 654',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234571'
            ],
            [
                'nome' => 'Fernanda Rodrigues',
                'email' => 'fernanda.rodrigues@email.com',
                'telefone' => '(11) 98888-6666',
                'cpf' => '12345678906',
                'endereco' => 'Rua Consolação, 987',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234572'
            ],
            [
                'nome' => 'Ricardo Almeida',
                'email' => 'ricardo.almeida@email.com',
                'telefone' => '(11) 98888-7777',
                'cpf' => '12345678907',
                'endereco' => 'Av. Rebouças, 147',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234573'
            ],
            [
                'nome' => 'Juliana Ferreira',
                'email' => 'juliana.ferreira@email.com',
                'telefone' => '(11) 98888-8888',
                'cpf' => '12345678908',
                'endereco' => 'Rua Bela Vista, 258',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234574'
            ],
            [
                'nome' => 'Roberto Silva',
                'email' => 'roberto.silva@email.com',
                'telefone' => '(11) 98888-9999',
                'cpf' => '12345678909',
                'endereco' => 'Av. Brasil, 369',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234575'
            ],
            [
                'nome' => 'Camila Souza',
                'email' => 'camila.souza@email.com',
                'telefone' => '(11) 98888-0000',
                'cpf' => '12345678910',
                'endereco' => 'Rua Liberdade, 741',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234576'
            ]
        ];

        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }

        // Criar animais
        $especies = ['Cão', 'Gato', 'Pássaro', 'Coelho', 'Peixe'];
        $nomesCaes = ['Rex', 'Buddy', 'Max', 'Charlie', 'Cooper', 'Rocky', 'Duke', 'Bear', 'Tucker', 'Oliver'];
        $nomesGatos = ['Mimi', 'Luna', 'Felix', 'Whiskers', 'Shadow', 'Smokey', 'Tiger', 'Princess', 'Mittens', 'Bella'];
        $nomesPassaros = ['Piu', 'Canário', 'Loro', 'Papagaio', 'Bem-te-vi'];
        $nomesCoelhos = ['Bunny', 'Rabbit', 'Coelhinho', 'Fofo', 'Branquinho'];
        $nomesPeixes = ['Nemo', 'Dory', 'Goldie', 'Bubble', 'Flash'];

        $clienteIds = Cliente::pluck('id')->toArray();
        $animaisData = [];

        foreach ($clienteIds as $clienteId) {
            // Cada cliente terá entre 1 e 3 animais
            $numAnimais = rand(1, 3);
            
            for ($i = 0; $i < $numAnimais; $i++) {
                $especie = $especies[array_rand($especies)];
                
                switch ($especie) {
                    case 'Cão':
                        $nome = $nomesCaes[array_rand($nomesCaes)];
                        $raca = ['Labrador', 'Golden Retriever', 'Pastor Alemão', 'Bulldog', 'Poodle'][array_rand(['Labrador', 'Golden Retriever', 'Pastor Alemão', 'Bulldog', 'Poodle'])];
                        break;
                    case 'Gato':
                        $nome = $nomesGatos[array_rand($nomesGatos)];
                        $raca = ['Persa', 'Siamês', 'Maine Coon', 'British Shorthair', 'Ragdoll'][array_rand(['Persa', 'Siamês', 'Maine Coon', 'British Shorthair', 'Ragdoll'])];
                        break;
                    case 'Pássaro':
                        $nome = $nomesPassaros[array_rand($nomesPassaros)];
                        $raca = ['Canário', 'Papagaio', 'Calopsita', 'Bem-te-vi'][array_rand(['Canário', 'Papagaio', 'Calopsita', 'Bem-te-vi'])];
                        break;
                    case 'Coelho':
                        $nome = $nomesCoelhos[array_rand($nomesCoelhos)];
                        $raca = 'Mini Lop';
                        break;
                    case 'Peixe':
                        $nome = $nomesPeixes[array_rand($nomesPeixes)];
                        $raca = 'Dourado';
                        break;
                }

                $animaisData[] = [
                    'nome' => $nome,
                    'especie' => $especie,
                    'raca' => $raca,
                    'sexo' => ['macho', 'femea'][array_rand(['macho', 'femea'])],
                    'data_nascimento' => Carbon::now()->subMonths(rand(2, 120))->format('Y-m-d'),
                    'peso' => $especie === 'Cão' ? rand(5, 50) : ($especie === 'Gato' ? rand(2, 8) : rand(1, 3)),
                    'cor' => ['Preto', 'Branco', 'Marrom', 'Cinza', 'Dourado'][array_rand(['Preto', 'Branco', 'Marrom', 'Cinza', 'Dourado'])],
                    'cliente_id' => $clienteId,
                    'created_at' => Carbon::now()->subDays(rand(1, 365)),
                    'updated_at' => Carbon::now()
                ];
            }
        }

        foreach ($animaisData as $animal) {
            Animal::create($animal);
        }

        // Criar consultas
        $animalIds = Animal::pluck('id')->toArray();
        $veterinarioIds = Veterinario::pluck('id')->toArray();
        $procedureIds = Procedure::pluck('id')->toArray();
        $statuses = ['agendada', 'realizada', 'cancelada'];

        $consultasData = [];
        $now = Carbon::now();

        // Criar consultas dos últimos 6 meses
        for ($i = 0; $i < 200; $i++) {
            $dataConsulta = $now->copy()->subDays(rand(1, 180));
            $hora = rand(8, 17);
            $minuto = [0, 30][rand(0, 1)];
            
            $consultasData[] = [
                'data_consulta' => $dataConsulta->copy()->setTime($hora, $minuto),
                'motivo' => [
                    'Consulta de rotina',
                    'Vacinação anual',
                    'Problema de pele',
                    'Dor abdominal',
                    'Check-up geral',
                    'Ferimento',
                    'Problema respiratório',
                    'Emergência',
                    'Cirurgia eletiva',
                    'Exames preventivos'
                ][array_rand([
                    'Consulta de rotina',
                    'Vacinação anual',
                    'Problema de pele',
                    'Dor abdominal',
                    'Check-up geral',
                    'Ferimento',
                    'Problema respiratório',
                    'Emergência',
                    'Cirurgia eletiva',
                    'Exames preventivos'
                ])],
                'observacoes' => 'Observações da consulta geradas automaticamente.',
                'status' => $statuses[array_rand($statuses)],
                'valor' => rand(50, 500),
                'animal_id' => $animalIds[array_rand($animalIds)],
                'veterinario_id' => $veterinarioIds[array_rand($veterinarioIds)],
                'created_at' => $dataConsulta,
                'updated_at' => $dataConsulta
            ];
        }

        foreach ($consultasData as $consulta) {
            $consultaCriada = Consulta::create($consulta);
            
            // Adicionar procedimentos aleatórios para cada consulta
            $numProcedimentos = rand(1, 4);
            $procedimentosEscolhidos = array_rand($procedureIds, min($numProcedimentos, count($procedureIds)));
            
            if (!is_array($procedimentosEscolhidos)) {
                $procedimentosEscolhidos = [$procedimentosEscolhidos];
            }
            
            foreach ($procedimentosEscolhidos as $index) {
                $procedure = Procedure::find($procedureIds[$index]);
                $consultaCriada->procedures()->attach($procedureIds[$index], [
                    'quantidade' => rand(1, 3),
                    'valor_unitario' => $procedure->preco,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        $this->command->info('Dados de teste para relatórios criados com sucesso!');
        $this->command->info('- ' . count($clientes) . ' clientes');
        $this->command->info('- ' . count($animaisData) . ' animais');
        $this->command->info('- ' . count($veterinarios) . ' veterinários');
        $this->command->info('- ' . count($procedures) . ' procedimentos');
        $this->command->info('- ' . count($consultasData) . ' consultas');
    }
}
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar usuário administrador padrão
        User::firstOrCreate(
            ['email' => 'admin@veterinaria.com'],
            [
                'name' => 'Administrador',
                'email' => 'admin@veterinaria.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Criar usuário de exemplo
        User::firstOrCreate(
            ['email' => 'veterinario@teste.com'],
            [
                'name' => 'Dr. João Silva',
                'email' => 'veterinario@teste.com',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
            ]
        );
    }
}

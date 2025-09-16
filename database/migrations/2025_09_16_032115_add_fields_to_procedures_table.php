<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('procedures', function (Blueprint $table) {
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->decimal('preco', 10, 2);
            $table->integer('duracao_minutos')->default(30); // duração em minutos
            $table->boolean('ativo')->default(true);
            $table->string('categoria')->nullable(); // ex: consulta, cirurgia, exame, vacinação
            $table->text('observacoes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('procedures', function (Blueprint $table) {
            $table->dropColumn([
                'nome',
                'descricao',
                'preco',
                'duracao_minutos',
                'ativo',
                'categoria',
                'observacoes'
            ]);
        });
    }
};

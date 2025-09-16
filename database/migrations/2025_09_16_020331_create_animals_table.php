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
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('especie'); // cachorro, gato, etc
            $table->string('raca')->nullable();
            $table->enum('sexo', ['macho', 'femea']);
            $table->date('data_nascimento')->nullable();
            $table->decimal('peso', 5, 2)->nullable();
            $table->string('cor')->nullable();
            $table->text('observacoes')->nullable();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};

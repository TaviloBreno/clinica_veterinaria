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
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animals')->onDelete('cascade');
            $table->foreignId('veterinario_id')->constrained('veterinarios')->onDelete('cascade');
            $table->datetime('data_consulta');
            $table->text('motivo');
            $table->text('diagnostico')->nullable();
            $table->text('tratamento')->nullable();
            $table->text('observacoes')->nullable();
            $table->decimal('valor', 10, 2)->nullable();
            $table->enum('status', ['agendada', 'realizada', 'cancelada'])->default('agendada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};

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
        Schema::create('consulta_procedures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consulta_id')->constrained('consultas')->onDelete('cascade');
            $table->foreignId('procedure_id')->constrained('procedures')->onDelete('cascade');
            $table->integer('quantidade')->default(1);
            $table->decimal('valor_unitario', 10, 2);
            $table->text('observacoes')->nullable();
            $table->timestamps();

            // Índices
            $table->unique(['consulta_id', 'procedure_id']);
            $table->index('consulta_id');
            $table->index('procedure_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consulta_procedures');
    }
};

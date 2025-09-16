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
        // Add key indexes for performance optimization
        try {
            Schema::table('clientes', function (Blueprint $table) {
                $table->index(['created_at'], 'idx_clientes_created_at');
                $table->index(['nome'], 'idx_clientes_nome');
                $table->index(['email'], 'idx_clientes_email');
            });
        } catch (\Exception $e) {
            // Indexes may already exist, ignore
        }

        try {
            Schema::table('animals', function (Blueprint $table) {
                $table->index(['especie'], 'idx_animals_especie');
                $table->index(['sexo'], 'idx_animals_sexo');
                $table->index(['created_at'], 'idx_animals_created_at');
                $table->index(['nome'], 'idx_animals_nome');
            });
        } catch (\Exception $e) {
            // Indexes may already exist, ignore
        }

        try {
            Schema::table('veterinarios', function (Blueprint $table) {
                $table->index(['especialidade'], 'idx_veterinarios_especialidade');
                $table->index(['nome'], 'idx_veterinarios_nome');
                $table->index(['crmv'], 'idx_veterinarios_crmv');
            });
        } catch (\Exception $e) {
            // Indexes may already exist, ignore
        }

        try {
            Schema::table('consultas', function (Blueprint $table) {
                $table->index(['data_consulta'], 'idx_consultas_data_consulta');
                $table->index(['status'], 'idx_consultas_status');
                $table->index(['created_at'], 'idx_consultas_created_at');
                // Compound indexes for better performance
                $table->index(['data_consulta', 'status'], 'idx_consultas_data_status');
                $table->index(['veterinario_id', 'data_consulta'], 'idx_consultas_vet_data');
            });
        } catch (\Exception $e) {
            // Indexes may already exist, ignore
        }

        try {
            Schema::table('procedures', function (Blueprint $table) {
                $table->index(['ativo'], 'idx_procedures_ativo');
                $table->index(['preco'], 'idx_procedures_preco');
                $table->index(['nome'], 'idx_procedures_nome');
            });
        } catch (\Exception $e) {
            // Indexes may already exist, ignore
        }
    }

    /**
     * Check if an index exists on a table
     */
    private function hasIndex($table, $index)
    {
        $indexes = Schema::getConnection()->getDoctrineSchemaManager()->listTableIndexes($table);
        return array_key_exists($index, $indexes);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['nome']);
            $table->dropIndex(['email']);
        });

        Schema::table('animals', function (Blueprint $table) {
            $table->dropIndex(['cliente_id']);
            $table->dropIndex(['especie']);
            $table->dropIndex(['sexo']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['nome']);
        });

        Schema::table('veterinarios', function (Blueprint $table) {
            $table->dropIndex(['especialidade']);
            $table->dropIndex(['nome']);
            $table->dropIndex(['crmv']);
        });

        Schema::table('consultas', function (Blueprint $table) {
            $table->dropIndex(['data_consulta']);
            $table->dropIndex(['status']);
            $table->dropIndex(['veterinario_id']);
            $table->dropIndex(['animal_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['data_consulta', 'status']);
            $table->dropIndex(['veterinario_id', 'data_consulta']);
        });

        Schema::table('procedures', function (Blueprint $table) {
            $table->dropIndex(['ativo']);
            $table->dropIndex(['preco']);
            $table->dropIndex(['nome']);
        });

        Schema::table('consulta_procedures', function (Blueprint $table) {
            $table->dropIndex(['consulta_id']);
            $table->dropIndex(['procedure_id']);
            $table->dropIndex(['consulta_id', 'procedure_id']);
        });
    }
};

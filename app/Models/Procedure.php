<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Procedure extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'duracao_minutos',
        'ativo',
        'categoria',
        'observacoes'
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
        'duracao_minutos' => 'integer'
    ];

    // Scopes para filtros comuns
    public function scopeAtivo($query)
    {
        return $query->where('ativo', true);
    }

    public function scopeCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }
}

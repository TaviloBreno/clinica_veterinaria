<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Procedure extends Model
{
    use HasFactory;
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

    // Relacionamentos
    public function consultas(): BelongsToMany
    {
        return $this->belongsToMany(Consulta::class, 'consulta_procedures')
                    ->withPivot('quantidade', 'valor_unitario', 'observacoes')
                    ->withTimestamps();
    }

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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Animal extends Model
{
    protected $fillable = [
        'nome',
        'especie',
        'raca',
        'sexo',
        'data_nascimento',
        'peso',
        'cor',
        'observacoes',
        'cliente_id',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'peso' => 'decimal:2',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class);
    }
}

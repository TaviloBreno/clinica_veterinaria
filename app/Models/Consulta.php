<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consulta extends Model
{
    protected $fillable = [
        'animal_id',
        'veterinario_id',
        'data_consulta',
        'motivo',
        'diagnostico',
        'tratamento',
        'observacoes',
        'valor',
        'status',
    ];

    protected $casts = [
        'data_consulta' => 'datetime',
        'valor' => 'decimal:2',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function veterinario(): BelongsTo
    {
        return $this->belongsTo(Veterinario::class);
    }
}

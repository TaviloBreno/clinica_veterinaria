<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function procedures(): BelongsToMany
    {
        return $this->belongsToMany(Procedure::class, 'consulta_procedures')
                    ->withPivot('quantidade', 'valor_unitario', 'observacoes')
                    ->withTimestamps();
    }

    // Scopes úteis
    public function scopeHoje($query)
    {
        return $query->whereDate('data_consulta', today());
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Accessors
    public function getValorTotalAttribute()
    {
        return $this->procedures->sum(function ($procedure) {
            return $procedure->pivot->quantidade * $procedure->pivot->valor_unitario;
        });
    }
}

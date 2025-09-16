<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Veterinario extends Model
{
    use HasFactory;
    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'crmv',
        'especialidade',
        'observacoes',
    ];

    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class);
    }
}

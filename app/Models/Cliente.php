<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;
    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'cpf',
        'endereco',
        'cidade',
        'estado',
        'cep',
    ];

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }
}

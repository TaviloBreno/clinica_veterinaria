import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import MainLayout from '../../components/Layout/MainLayout';
import { api } from '../../lib/api';

export default function PetEdit({ petId, onBack, onPetUpdated }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [errors, setErrors] = useState({});
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        especie: '',
        raca: '',
        sexo: '',
        data_nascimento: '',
        peso: '',
        cor: '',
        observacoes: '',
        cliente_id: ''
    });

    useEffect(() => {
        if (petId) {
            fetchPet();
            fetchClientes();
        }
    }, [petId]);

    const fetchPet = async () => {
        try {
            setLoadingData(true);
            const response = await api.get(`/api/animals/${petId}`);
            const pet = response.data;

            setFormData({
                nome: pet.nome,
                especie: pet.especie,
                raca: pet.raca || '',
                sexo: pet.sexo,
                data_nascimento: pet.data_nascimento || '',
                peso: pet.peso || '',
                cor: pet.cor || '',
                observacoes: pet.observacoes || '',
                cliente_id: pet.cliente_id.toString()
            });
        } catch (error) {
            console.error('Erro ao carregar pet:', error);
            alert('Erro ao carregar dados do pet');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchClientes = async () => {
        try {
            setLoadingClientes(true);
            const response = await api.get('/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar lista de clientes');
        } finally {
            setLoadingClientes(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validação do nome
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        // Validação da espécie
        if (!formData.especie.trim()) {
            newErrors.especie = 'Espécie é obrigatória';
        }

        // Validação do sexo
        if (!formData.sexo) {
            newErrors.sexo = 'Sexo é obrigatório';
        }

        // Validação do cliente
        if (!formData.cliente_id) {
            newErrors.cliente_id = 'Cliente é obrigatório';
        }

        // Validação do peso (se preenchido)
        if (formData.peso && (isNaN(formData.peso) || parseFloat(formData.peso) <= 0)) {
            newErrors.peso = 'Peso deve ser um número positivo';
        }

        // Validação da data de nascimento (se preenchida)
        if (formData.data_nascimento) {
            const hoje = new Date();
            const dataNascimento = new Date(formData.data_nascimento);
            if (dataNascimento > hoje) {
                newErrors.data_nascimento = 'Data de nascimento não pode ser no futuro';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Preparar dados para envio
            const dataToSend = {
                ...formData,
                peso: formData.peso ? parseFloat(formData.peso) : null,
                cliente_id: parseInt(formData.cliente_id)
            };

            const response = await api.put(`/api/animals/${petId}`, dataToSend);

            alert('Pet atualizado com sucesso!');

            // Chamar callback se fornecido
            if (onPetUpdated) {
                onPetUpdated(response.data);
            }

        } catch (error) {
            console.error('Erro ao atualizar pet:', error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Erro ao atualizar pet. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const especies = [
        'Cachorro',
        'Gato',
        'Coelho',
        'Hamster',
        'Pássaro',
        'Peixe',
        'Réptil',
        'Outro'
    ];

    if (loadingData || loadingClientes) {
        return (
            <MainLayout title="Editar Pet">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando dados do pet...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Editar Pet">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            onClick={onBack}
                        >
                            ← Voltar
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Editar Pet</h2>
                            <p className="text-gray-600">Atualize as informações do animal</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Pet</CardTitle>
                        <CardDescription>
                            Todos os campos marcados com * são obrigatórios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Cliente */}
                            <div className="space-y-2">
                                <Label htmlFor="cliente_id">Cliente (Dono) *</Label>
                                <select
                                    id="cliente_id"
                                    name="cliente_id"
                                    value={formData.cliente_id}
                                    onChange={handleChange}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.cliente_id ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Selecione um cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.cliente_id && (
                                    <p className="text-sm text-red-600">{errors.cliente_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nome */}
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome do Pet *</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Ex: Rex, Mimi, Bob"
                                        className={errors.nome ? 'border-red-500' : ''}
                                    />
                                    {errors.nome && (
                                        <p className="text-sm text-red-600">{errors.nome}</p>
                                    )}
                                </div>

                                {/* Espécie */}
                                <div className="space-y-2">
                                    <Label htmlFor="especie">Espécie *</Label>
                                    <select
                                        id="especie"
                                        name="especie"
                                        value={formData.especie}
                                        onChange={handleChange}
                                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.especie ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Selecione a espécie</option>
                                        {especies.map(especie => (
                                            <option key={especie} value={especie}>
                                                {especie}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.especie && (
                                        <p className="text-sm text-red-600">{errors.especie}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Raça */}
                                <div className="space-y-2">
                                    <Label htmlFor="raca">Raça</Label>
                                    <Input
                                        id="raca"
                                        name="raca"
                                        type="text"
                                        value={formData.raca}
                                        onChange={handleChange}
                                        placeholder="Ex: Labrador, Persa, SRD"
                                        className={errors.raca ? 'border-red-500' : ''}
                                    />
                                    {errors.raca && (
                                        <p className="text-sm text-red-600">{errors.raca}</p>
                                    )}
                                </div>

                                {/* Sexo */}
                                <div className="space-y-2">
                                    <Label htmlFor="sexo">Sexo *</Label>
                                    <select
                                        id="sexo"
                                        name="sexo"
                                        value={formData.sexo}
                                        onChange={handleChange}
                                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.sexo ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Selecione o sexo</option>
                                        <option value="macho">Macho</option>
                                        <option value="femea">Fêmea</option>
                                    </select>
                                    {errors.sexo && (
                                        <p className="text-sm text-red-600">{errors.sexo}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Data de Nascimento */}
                                <div className="space-y-2">
                                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                                    <Input
                                        id="data_nascimento"
                                        name="data_nascimento"
                                        type="date"
                                        value={formData.data_nascimento}
                                        onChange={handleChange}
                                        className={errors.data_nascimento ? 'border-red-500' : ''}
                                    />
                                    {errors.data_nascimento && (
                                        <p className="text-sm text-red-600">{errors.data_nascimento}</p>
                                    )}
                                </div>

                                {/* Peso */}
                                <div className="space-y-2">
                                    <Label htmlFor="peso">Peso (kg)</Label>
                                    <Input
                                        id="peso"
                                        name="peso"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        placeholder="Ex: 5.5"
                                        className={errors.peso ? 'border-red-500' : ''}
                                    />
                                    {errors.peso && (
                                        <p className="text-sm text-red-600">{errors.peso}</p>
                                    )}
                                </div>

                                {/* Cor */}
                                <div className="space-y-2">
                                    <Label htmlFor="cor">Cor</Label>
                                    <Input
                                        id="cor"
                                        name="cor"
                                        type="text"
                                        value={formData.cor}
                                        onChange={handleChange}
                                        placeholder="Ex: Preto, Branco, Caramelo"
                                        className={errors.cor ? 'border-red-500' : ''}
                                    />
                                    {errors.cor && (
                                        <p className="text-sm text-red-600">{errors.cor}</p>
                                    )}
                                </div>
                            </div>

                            {/* Observações */}
                            <div className="space-y-2">
                                <Label htmlFor="observacoes">Observações</Label>
                                <textarea
                                    id="observacoes"
                                    name="observacoes"
                                    value={formData.observacoes}
                                    onChange={handleChange}
                                    placeholder="Informações adicionais sobre o pet..."
                                    rows={3}
                                    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.observacoes ? 'border-red-500' : ''}`}
                                />
                                {errors.observacoes && (
                                    <p className="text-sm text-red-600">{errors.observacoes}</p>
                                )}
                            </div>

                            {/* Botões */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onBack}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Atualizando...
                                        </div>
                                    ) : (
                                        'Atualizar Pet'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}

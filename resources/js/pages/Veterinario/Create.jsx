import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { api } from '../../lib/api';

export default function VeterinarioCreate({ onBack, onVeterinarioCreated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        crmv: '',
        especialidade: '',
        observacoes: ''
    });
    const [errors, setErrors] = useState({});

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
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post('/api/veterinarios', formData);
            onVeterinarioCreated();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Erro ao criar veterinário');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-300 text-xl">👨‍⚕️</span>
                            </div>
                            <div>
                                <CardTitle>Cadastrar Novo Veterinário</CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Preencha os dados do veterinário
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Ex: Dr. João Silva"
                                        required
                                    />
                                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome[0]}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="crmv">CRMV *</Label>
                                    <Input
                                        id="crmv"
                                        name="crmv"
                                        value={formData.crmv}
                                        onChange={handleChange}
                                        placeholder="Ex: CRMV-SP 12345"
                                        required
                                    />
                                    {errors.crmv && <p className="text-red-500 text-sm mt-1">{errors.crmv[0]}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="veterinario@clinica.com"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="telefone">Telefone *</Label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(11) 99999-9999"
                                        required
                                    />
                                    {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="especialidade">Especialidade</Label>
                                <Input
                                    id="especialidade"
                                    name="especialidade"
                                    value={formData.especialidade}
                                    onChange={handleChange}
                                    placeholder="Ex: Cirurgia, Dermatologia, Clínica Geral"
                                />
                                {errors.especialidade && <p className="text-red-500 text-sm mt-1">{errors.especialidade[0]}</p>}
                            </div>

                            <div>
                                <Label htmlFor="observacoes">Observações</Label>
                                <textarea
                                    id="observacoes"
                                    name="observacoes"
                                    value={formData.observacoes}
                                    onChange={handleChange}
                                    placeholder="Informações adicionais sobre o veterinário"
                                    rows={3}
                                    className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-white"
                                />
                                {errors.observacoes && <p className="text-red-500 text-sm mt-1">{errors.observacoes[0]}</p>}
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Salvando...' : 'Salvar Veterinário'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

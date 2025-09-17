import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { api } from '../../lib/api';

export default function ClienteEdit({ clienteId, onBack, onClienteUpdated }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        observacoes: ''
    });

    useEffect(() => {
        if (clienteId) {
            fetchCliente();
        }
    }, [clienteId]);

    const fetchCliente = async () => {
        try {
            setLoadingData(true);
            const response = await api.get(`/api/clientes/${clienteId}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            alert('Erro ao carregar cliente');
        } finally {
            setLoadingData(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpar erro do campo quando usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        }
        
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        }
        
        if (!formData.endereco.trim()) {
            newErrors.endereco = 'Endereço é obrigatório';
        }
        
        if (!formData.cidade.trim()) {
            newErrors.cidade = 'Cidade é obrigatória';
        }
        
        if (!formData.estado.trim()) {
            newErrors.estado = 'Estado é obrigatório';
        }
        
        if (!formData.cep.trim()) {
            newErrors.cep = 'CEP é obrigatório';
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
            
            // Preparar dados para envio (remover caracteres especiais)
            const dataToSend = {
                ...formData,
                telefone: formData.telefone.replace(/\D/g, ''),
                cpf: formData.cpf.replace(/\D/g, ''),
                cep: formData.cep.replace(/\D/g, '')
            };
            
            const response = await api.put(`/api/clientes/${clienteId}`, dataToSend);
            alert('Cliente atualizado com sucesso!');
            
            if (onClienteUpdated) {
                onClienteUpdated();
            }
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert('Erro ao atualizar cliente');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value) => {
        const cpf = value.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatTelefone = (value) => {
        const telefone = value.replace(/\D/g, '');
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    const formatCEP = (value) => {
        const cep = value.replace(/\D/g, '');
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handleCPFChange = (e) => {
        const formatted = formatCPF(e.target.value);
        setFormData(prev => ({ ...prev, cpf: formatted }));
    };

    const handleTelefoneChange = (e) => {
        const formatted = formatTelefone(e.target.value);
        setFormData(prev => ({ ...prev, telefone: formatted }));
    };

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);
        setFormData(prev => ({ ...prev, cep: formatted }));
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Carregando cliente...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Editar Cliente</CardTitle>
                            <CardDescription>
                                Atualize as informações do cliente
                            </CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={onBack}
                            disabled={loading}
                        >
                            Voltar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nome">Nome *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className={errors.nome ? 'border-red-500' : ''}
                                />
                                {errors.nome && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="telefone">Telefone *</Label>
                                <Input
                                    id="telefone"
                                    name="telefone"
                                    type="text"
                                    value={formData.telefone}
                                    onChange={handleTelefoneChange}
                                    disabled={loading}
                                    placeholder="(11) 99999-9999"
                                    className={errors.telefone ? 'border-red-500' : ''}
                                />
                                {errors.telefone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="cpf">CPF *</Label>
                                <Input
                                    id="cpf"
                                    name="cpf"
                                    type="text"
                                    value={formData.cpf}
                                    onChange={handleCPFChange}
                                    disabled={loading}
                                    placeholder="000.000.000-00"
                                    className={errors.cpf ? 'border-red-500' : ''}
                                />
                                {errors.cpf && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="endereco">Endereço *</Label>
                            <Input
                                id="endereco"
                                name="endereco"
                                type="text"
                                value={formData.endereco}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="Rua, número - bairro"
                                className={errors.endereco ? 'border-red-500' : ''}
                            />
                            {errors.endereco && (
                                <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="cidade">Cidade *</Label>
                                <Input
                                    id="cidade"
                                    name="cidade"
                                    type="text"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className={errors.cidade ? 'border-red-500' : ''}
                                />
                                {errors.cidade && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="estado">Estado *</Label>
                                <Input
                                    id="estado"
                                    name="estado"
                                    type="text"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="SP"
                                    maxLength={2}
                                    className={errors.estado ? 'border-red-500' : ''}
                                />
                                {errors.estado && (
                                    <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="cep">CEP *</Label>
                                <Input
                                    id="cep"
                                    name="cep"
                                    type="text"
                                    value={formData.cep}
                                    onChange={handleCEPChange}
                                    disabled={loading}
                                    placeholder="00000-000"
                                    className={errors.cep ? 'border-red-500' : ''}
                                />
                                {errors.cep && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="Observações adicionais sobre o cliente..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Atualizando...' : 'Atualizar Cliente'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={onBack}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
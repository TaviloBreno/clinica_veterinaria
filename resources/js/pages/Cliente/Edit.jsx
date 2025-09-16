import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import MainLayout from '../Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function ClienteEdit({ clienteId, onBack, onClienteUpdated }) {
    const { axiosInstance } = useAuth();
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
        cep: ''
    });

    useEffect(() => {
        if (clienteId) {
            fetchCliente();
        }
    }, [clienteId]);

    const fetchCliente = async () => {
        try {
            setLoadingData(true);
            const response = await axiosInstance.get(`/api/clientes/${clienteId}`);
            const cliente = response.data;

            setFormData({
                nome: cliente.nome,
                email: cliente.email,
                telefone: formatTelefone(cliente.telefone),
                cpf: formatCPF(cliente.cpf),
                endereco: cliente.endereco,
                cidade: cliente.cidade,
                estado: cliente.estado,
                cep: formatCEP(cliente.cep)
            });
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            alert('Erro ao carregar dados do cliente');
        } finally {
            setLoadingData(false);
        }
    };

    const formatCEP = (cep) => {
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatTelefone = (telefone) => {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formatação automática para CPF
        if (name === 'cpf') {
            formattedValue = value
                .replace(/\D/g, '') // Remove tudo que não é dígito
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }

        // Formatação automática para telefone
        if (name === 'telefone') {
            formattedValue = value
                .replace(/\D/g, '') // Remove tudo que não é dígito
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }

        // Formatação automática para CEP
        if (name === 'cep') {
            formattedValue = value
                .replace(/\D/g, '') // Remove tudo que não é dígito
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
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

        // Validação do email
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email deve ter um formato válido';
        }

        // Validação do telefone
        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        } else if (formData.telefone.replace(/\D/g, '').length < 10) {
            newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
        }

        // Validação do CPF
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
            newErrors.cpf = 'CPF deve ter 11 dígitos';
        }

        // Validação do endereço
        if (!formData.endereco.trim()) {
            newErrors.endereco = 'Endereço é obrigatório';
        } else if (formData.endereco.trim().length < 10) {
            newErrors.endereco = 'Endereço deve ter pelo menos 10 caracteres';
        }

        // Validação da cidade
        if (!formData.cidade.trim()) {
            newErrors.cidade = 'Cidade é obrigatória';
        }

        // Validação do estado
        if (!formData.estado.trim()) {
            newErrors.estado = 'Estado é obrigatório';
        } else if (formData.estado.length !== 2) {
            newErrors.estado = 'Estado deve ter 2 caracteres (ex: SP)';
        }

        // Validação do CEP
        if (!formData.cep.trim()) {
            newErrors.cep = 'CEP é obrigatório';
        } else if (formData.cep.replace(/\D/g, '').length !== 8) {
            newErrors.cep = 'CEP deve ter 8 dígitos';
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

            // Remover formatação antes de enviar
            const dataToSend = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                telefone: formData.telefone.replace(/\D/g, ''),
                cep: formData.cep.replace(/\D/g, ''),
                estado: formData.estado.toUpperCase()
            };

            const response = await axiosInstance.put(`/api/clientes/${clienteId}`, dataToSend);

            alert('Cliente atualizado com sucesso!');

            // Chamar callback se fornecido
            if (onClienteUpdated) {
                onClienteUpdated(response.data);
            }

        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Erro ao atualizar cliente. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <MainLayout title="Editar Cliente">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando dados do cliente...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Editar Cliente">
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
                            <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
                            <p className="text-gray-600">Atualize as informações do cliente</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Cliente</CardTitle>
                        <CardDescription>
                            Todos os campos marcados com * são obrigatórios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nome */}
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o nome completo"
                                    className={errors.nome ? 'border-red-500' : ''}
                                />
                                {errors.nome && (
                                    <p className="text-sm text-red-600">{errors.nome}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemplo@email.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Telefone */}
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone *</Label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        type="text"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(11) 99999-9999"
                                        maxLength={15}
                                        className={errors.telefone ? 'border-red-500' : ''}
                                    />
                                    {errors.telefone && (
                                        <p className="text-sm text-red-600">{errors.telefone}</p>
                                    )}
                                </div>

                                {/* CPF */}
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF *</Label>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        type="text"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className={errors.cpf ? 'border-red-500' : ''}
                                    />
                                    {errors.cpf && (
                                        <p className="text-sm text-red-600">{errors.cpf}</p>
                                    )}
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço *</Label>
                                <Input
                                    id="endereco"
                                    name="endereco"
                                    type="text"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    placeholder="Rua, número, bairro"
                                    className={errors.endereco ? 'border-red-500' : ''}
                                />
                                {errors.endereco && (
                                    <p className="text-sm text-red-600">{errors.endereco}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Cidade */}
                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade *</Label>
                                    <Input
                                        id="cidade"
                                        name="cidade"
                                        type="text"
                                        value={formData.cidade}
                                        onChange={handleChange}
                                        placeholder="Nome da cidade"
                                        className={errors.cidade ? 'border-red-500' : ''}
                                    />
                                    {errors.cidade && (
                                        <p className="text-sm text-red-600">{errors.cidade}</p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado *</Label>
                                    <Input
                                        id="estado"
                                        name="estado"
                                        type="text"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        placeholder="SP"
                                        maxLength={2}
                                        className={errors.estado ? 'border-red-500' : ''}
                                    />
                                    {errors.estado && (
                                        <p className="text-sm text-red-600">{errors.estado}</p>
                                    )}
                                </div>

                                {/* CEP */}
                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP *</Label>
                                    <Input
                                        id="cep"
                                        name="cep"
                                        type="text"
                                        value={formData.cep}
                                        onChange={handleChange}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        className={errors.cep ? 'border-red-500' : ''}
                                    />
                                    {errors.cep && (
                                        <p className="text-sm text-red-600">{errors.cep}</p>
                                    )}
                                </div>
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
                                        'Atualizar Cliente'
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

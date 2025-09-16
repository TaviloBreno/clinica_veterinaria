import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function PetIndex({ onNewPet, onEditPet }) {
    const { axiosInstance } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPets, setFilteredPets] = useState([]);

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        // Filtrar pets baseado no termo de busca
        const filtered = pets.filter(pet =>
            pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.raca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPets(filtered);
    }, [pets, searchTerm]);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/animals');
            setPets(response.data);
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            alert('Erro ao carregar pets');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este pet?')) {
            try {
                await axiosInstance.delete(`/api/animals/${id}`);
                alert('Pet excluído com sucesso!');
                fetchPets();
            } catch (error) {
                console.error('Erro ao excluir pet:', error);
                alert('Erro ao excluir pet');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getIdadeAproximada = (dataNascimento) => {
        if (!dataNascimento) return 'Não informado';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        const diffTime = Math.abs(hoje - nascimento);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} dia(s)`;
        } else if (diffDays < 365) {
            const meses = Math.floor(diffDays / 30);
            return `${meses} mês(es)`;
        } else {
            const anos = Math.floor(diffDays / 365);
            const meses = Math.floor((diffDays % 365) / 30);
            return meses > 0 ? `${anos} ano(s) e ${meses} mês(es)` : `${anos} ano(s)`;
        }
    };

    if (loading) {
        return (
            <MainLayout title="Pets">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando pets...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Gerenciar Pets">
            <div className="space-y-6">
                {/* Header com busca */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Pets</h2>
                        <p className="text-gray-600">Gerencie os animais da clínica veterinária</p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={onNewPet}>
                        + Novo Pet
                    </Button>
                </div>

                {/* Barra de busca */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Pets</CardTitle>
                        <CardDescription>
                            Pesquise por nome do pet, espécie, raça ou dono
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Buscar</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Digite o nome do pet, espécie, raça ou dono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cards de pets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPets.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🐕</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? 'Tente ajustar os termos da sua busca'
                                    : 'Comece adicionando um novo pet'
                                }
                            </p>
                            {!searchTerm && (
                                <Button onClick={onNewPet}>
                                    + Adicionar Primeiro Pet
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredPets.map((pet) => (
                            <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">
                                                    {pet.especie.toLowerCase() === 'cachorro' || pet.especie.toLowerCase() === 'cão' ? '🐕' :
                                                     pet.especie.toLowerCase() === 'gato' ? '🐱' : '🐾'}
                                                </span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{pet.nome}</CardTitle>
                                                <CardDescription>
                                                    {pet.especie} • {pet.sexo === 'macho' ? 'Macho' : 'Fêmea'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Raça:</span>
                                            <p className="text-gray-900">{pet.raca || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Idade:</span>
                                            <p className="text-gray-900">{getIdadeAproximada(pet.data_nascimento)}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Peso:</span>
                                            <p className="text-gray-900">{pet.peso ? `${pet.peso} kg` : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Cor:</span>
                                            <p className="text-gray-900">{pet.cor || 'Não informado'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t">
                                        <span className="font-medium text-gray-600 text-sm">Dono:</span>
                                        <p className="text-gray-900 font-medium">{pet.cliente?.nome}</p>
                                    </div>

                                    {pet.observacoes && (
                                        <div className="pt-2">
                                            <span className="font-medium text-gray-600 text-sm">Observações:</span>
                                            <p className="text-gray-900 text-sm mt-1 line-clamp-2">{pet.observacoes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => onEditPet(pet.id)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(pet.id)}
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

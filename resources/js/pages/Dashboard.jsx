import React, { useState } from 'react';
import Home from './Home';
import ClienteManager from './Cliente/Manager';
import PetManager from './Pet/Manager';
import VeterinarioManager from './Veterinario/Manager';

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState('home'); // 'home', 'clientes', 'animais', 'veterinarios', 'consultas'

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleNavigateToClientes = () => {
        setCurrentPage('clientes');
    };

    const handleNavigateToAnimais = () => {
        setCurrentPage('animais');
    };

    const handleNavigateToVeterinarios = () => {
        setCurrentPage('veterinarios');
    };

    const handleNavigateToHome = () => {
        setCurrentPage('home');
    };

    if (currentPage === 'clientes') {
        return <ClienteManager onBack={handleNavigateToHome} />;
    }

    if (currentPage === 'animais') {
        return <PetManager onBack={handleNavigateToHome} />;
    }

    if (currentPage === 'veterinarios') {
        return <VeterinarioManager onBack={handleNavigateToHome} />;
    }

    return (
        <Home
            onNavigateToClientes={handleNavigateToClientes}
            onNavigateToAnimais={handleNavigateToAnimais}
            onNavigateToVeterinarios={handleNavigateToVeterinarios}
            onNavigate={handleNavigate}
        />
    );
}

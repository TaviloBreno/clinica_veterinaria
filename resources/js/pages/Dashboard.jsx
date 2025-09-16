import React, { useState } from 'react';
import Home from './Home';
import ClienteManager from './Cliente/Manager';

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState('home'); // 'home', 'clientes', 'animais', 'veterinarios', 'consultas'

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleNavigateToClientes = () => {
        setCurrentPage('clientes');
    };

    const handleNavigateToHome = () => {
        setCurrentPage('home');
    };

    if (currentPage === 'clientes') {
        return <ClienteManager onBack={handleNavigateToHome} />;
    }

    return (
        <Home 
            onNavigateToClientes={handleNavigateToClientes}
            onNavigate={handleNavigate}
        />
    );
}

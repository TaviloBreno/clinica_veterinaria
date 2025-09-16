import React, { useState, useEffect } from 'react';
import Home from './Home';
import ClienteManager from './Cliente/Manager';
import PetManager from './Pet/Manager';
import VeterinarioManager from './Veterinario/Manager';
import ConsultaManager from './consultas/Manager';
import ReportsManager from './reports/Manager';

export default function Dashboard({ onNavigate }) {
    const [currentPage, setCurrentPage] = useState('home'); // 'home', 'clientes', 'animais', 'veterinarios', 'consultas', 'reports'

    // Escutar mudanças de navegação vinda do MainLayout
    useEffect(() => {
        if (onNavigate) {
            // Substitui a função interna de navegação
            window.dashboardNavigate = (page) => {
                setCurrentPage(page);
            };
        }
    }, [onNavigate]);

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

    const handleNavigateToConsultas = () => {
        setCurrentPage('consultas');
    };

    const handleNavigateToReports = () => {
        setCurrentPage('reports');
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

    if (currentPage === 'consultas') {
        return <ConsultaManager onBack={handleNavigateToHome} />;
    }

    if (currentPage === 'reports') {
        return <ReportsManager onBack={handleNavigateToHome} />;
    }

    return (
        <Home
            onNavigateToClientes={handleNavigateToClientes}
            onNavigateToAnimais={handleNavigateToAnimais}
            onNavigateToVeterinarios={handleNavigateToVeterinarios}
            onNavigateToConsultas={handleNavigateToConsultas}
            onNavigateToReports={handleNavigateToReports}
            onNavigate={handleNavigate}
        />
    );
}

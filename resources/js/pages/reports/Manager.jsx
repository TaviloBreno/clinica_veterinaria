import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ReportsIndex from './ReportsIndex';
import ClientReport from './ClientReport';
import PetReport from './PetReport';
import ProcedureReport from './ProcedureReport';
import VeterinarianReport from './VeterinarianReport';
import ConsultationReport from './ConsultationReport';

export default function ReportsManager({ onBack }) {
    const [currentView, setCurrentView] = useState('index'); // 'index', 'clients', 'pets', 'procedures', 'veterinarians', 'consultations'

    const handleNavigate = (page) => {
        if (page === 'home') {
            onBack();
        } else {
            setCurrentView(page);
        }
    };

    const handleNavigateToReport = (reportType) => {
        setCurrentView(reportType);
    };

    const handleBackToReports = () => {
        setCurrentView('index');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'clients':
                return <ClientReport onBack={handleBackToReports} />;
            case 'pets':
                return <PetReport onBack={handleBackToReports} />;
            case 'procedures':
                return <ProcedureReport onBack={handleBackToReports} />;
            case 'veterinarians':
                return <VeterinarianReport onBack={handleBackToReports} />;
            case 'consultations':
                return <ConsultationReport onBack={handleBackToReports} />;
            default:
                return <ReportsIndex onNavigateToReport={handleNavigateToReport} />;
        }
    };

    return (
        <MainLayout
            title="Relatórios"
            onNavigate={handleNavigate}
        >
            {renderCurrentView()}
        </MainLayout>
    );
}

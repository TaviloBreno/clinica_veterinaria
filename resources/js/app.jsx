import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Layout/MainLayout';

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
                </div>
            </div>
        );
    }

    const handleNavigate = (page) => {
        if (window.dashboardNavigate) {
            window.dashboardNavigate(page);
        }
    };

    return user ? (
        <MainLayout onNavigate={handleNavigate}>
            <Dashboard onNavigate={handleNavigate} />
        </MainLayout>
    ) : <LoginPage />;
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

// Encontrar o elemento root e renderizar a aplicação React
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

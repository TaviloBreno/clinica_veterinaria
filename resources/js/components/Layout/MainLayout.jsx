import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function MainLayout({ children, title = "Sistema Veterinário", onNavigate }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { name: 'Dashboard', href: 'home', icon: '🏠' },
        { name: 'Clientes', href: 'clientes', icon: '👥' },
        { name: 'Animais', href: 'animais', icon: '🐕' },
        { name: 'Veterinários', href: 'veterinarios', icon: '👨‍⚕️' },
        { name: 'Consultas', href: 'consultas', icon: '📅' },
        { name: 'Relatórios', href: 'reports', icon: '📊' },
    ];

    const handleMenuClick = (href) => {
        if (onNavigate) {
            onNavigate(href);
        }
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    ${sidebarCollapsed ? 'w-16' : 'w-64'} 
                    lg:translate-x-0 lg:static lg:inset-0`}>
                    
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            {!sidebarCollapsed && (
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">🏥</span>
                                    <span className="text-lg font-semibold dark:text-white">Sistema</span>
                                </div>
                            )}
                            {sidebarCollapsed && (
                                <div className="flex justify-center w-full">
                                    <span className="text-2xl">🏥</span>
                                </div>
                            )}
                            
                            {/* Desktop Collapse Button */}
                            <button
                                onClick={toggleSidebar}
                                className="hidden lg:block p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {sidebarCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    )}
                                </svg>
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleMenuClick(item.href)}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
                                        sidebarCollapsed ? 'justify-center' : ''
                                    }`}
                                    title={sidebarCollapsed ? item.name : ''}
                                >
                                    <span className={`text-lg ${sidebarCollapsed ? '' : 'mr-3'}`}>
                                        {item.icon}
                                    </span>
                                    {!sidebarCollapsed && item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center py-4">
                                <div className="flex items-center">
                                    {/* Mobile menu button */}
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden mr-3"
                                    >
                                        <span className="sr-only">Abrir menu</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    
                                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h1>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <ThemeToggle />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                                        Olá, {user?.name}
                                    </span>
                                    <Button variant="outline" size="sm" onClick={handleLogout}>
                                        Sair
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 py-6">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
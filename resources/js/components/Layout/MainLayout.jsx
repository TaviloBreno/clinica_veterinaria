import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function MainLayout({ children, title = "Sistema Veterinário", onNavigate }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { name: 'Dashboard', href: 'home', icon: '🏠' },
        { name: 'Clientes', href: 'clientes', icon: '👥' },
        { name: 'Animais', href: 'animais', icon: '🐕' },
        { name: 'Veterinários', href: 'veterinarios', icon: '👨‍⚕️' },
        { name: 'Consultas', href: 'consultas', icon: '📅' },
    ];

    const handleMenuClick = (href) => {
        if (onNavigate) {
            onNavigate(href);
        }
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                            >
                                <span className="sr-only">Abrir menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">🏥</span>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h1>
                            </div>
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

            <div className="flex">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 lg:hidden">
                            <span className="text-lg font-semibold dark:text-white">Menu</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleMenuClick(item.href)}
                                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
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
                <div className="flex-1 lg:ml-0">
                    <main className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
            {/* SIDEBAR */}
            {/* DHYAN DE: Yahan 'hidden' aur 'md:flex' ke beech mein ab normal space hai */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col md:flex">

                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        NexusCRM
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20 cursor-pointer">
                        <LayoutDashboard size={20} />
                        <span className="font-medium text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl cursor-pointer">
                        <Users size={20} />
                        <span className="font-medium text-sm">Leads</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl cursor-pointer">
                        <BarChart3 size={20} />
                        <span className="font-medium text-sm">Analytics</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl mb-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{user?.name || "User"}</p>
                            <p className="text-xs text-slate-400">{user?.role || "Admin"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                    <span className="font-bold text-indigo-500">NexusCRM</span>
                    <button onClick={handleLogout} className="text-slate-400"><LogOut size={20} /></button>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
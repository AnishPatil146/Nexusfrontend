import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, CheckSquare, FileText, Layers, LogOut,
    BarChart3, FileDown
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const location = useLocation();

    // Role Helpers
    const isCEO = user?.role === "admin" || user?.role === "ceo";
    const isManager = user?.role === "manager";
    const isEmployee = user?.role === "employee";

    const menuItems = [
        { title: "Dashboard", path: "/", icon: <LayoutDashboard size={20} />, show: true },

        // Performance: CEO aur Manager ke liye
        { title: "Performance", path: "/performance", icon: <BarChart3 size={20} />, show: isCEO || isManager },

        // Reports: Sirf CEO (Admin) ke liye
        { title: "Reports", path: "/reports", icon: <FileDown size={20} />, show: isCEO },

        { title: "Team", path: "/team", icon: <Users size={20} />, show: isCEO || isManager },

        // Leads/Invoices: Sirf Employee ke liye
        { title: "Leads", path: "/leads", icon: <Layers size={20} />, show: isEmployee },
        { title: "Tasks", path: "/tasks", icon: <CheckSquare size={20} />, show: true },
        { title: "Invoices", path: "/invoices", icon: <FileText size={20} />, show: isEmployee },
    ];

    return (
        <div className="h-full w-64 bg-[#0b1120] border-r border-slate-800 flex flex-col flex-shrink-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">NexusCRM</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    item.show && (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-slate-400 hover:bg-[#1e293b] hover:text-white"
                                }`}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    )
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 mt-auto">
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full font-bold">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 bg-black text-white min-h-screen p-4">
            <h1 className="text-xl font-bold mb-6">AI CRM</h1>

            <nav className="space-y-3">
                <NavLink to="/dashboard" className="block hover:text-blue-400">
                    Dashboard
                </NavLink>

                <NavLink to="/leads" className="block hover:text-blue-400">
                    Leads
                </NavLink>

                <NavLink to="/automation" className="block hover:text-blue-400">
                    Automation
                </NavLink>

                <NavLink to="/settings" className="block hover:text-blue-400">
                    Settings
                </NavLink>
            </nav>
        </div>
    );
}

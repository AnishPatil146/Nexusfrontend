import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {
    const location = useLocation()

    const linkClass = (path) =>
        `block px-2 py-1 rounded ${location.pathname === path
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:text-white"
        }`

    return (
        <div className="w-64 min-h-screen bg-black text-white p-5">
            <h1 className="text-2xl font-bold mb-8">AI CRM</h1>

            <ul className="space-y-4">
                <li>
                    <Link to="/dashboard" className={linkClass("/dashboard")}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/leads" className={linkClass("/leads")}>
                        Leads
                    </Link>
                </li>
                <li className="text-gray-300">Automation</li>
                <li className="text-gray-300">Settings</li>
            </ul>
        </div>
    )
}

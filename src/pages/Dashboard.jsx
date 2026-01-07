import Sidebar from "../components/Sidebar.jsx"
import Navbar from "../components/Navbar.jsx"
import StatCard from "../components/StatCard.jsx"

export default function Dashboard() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 bg-gray-100">

                <Navbar />



                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Leads" value="120" />
                    <StatCard title="Converted Leads" value="32" />
                    <StatCard title="Pending Follow-ups" value="18" />
                </div>
            </div>
        </div>
    )
}

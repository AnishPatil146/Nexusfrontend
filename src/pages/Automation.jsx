import Sidebar from "../components/sidebar.jsx"
import Navbar from "../components/Navbar"

export default function Automation() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6 text-xl">Automation Page</div>
            </div>
        </div>
    )
}

import { useEffect, useState } from "react"
import API from "../services/api"
import { Bar, Pie } from "react-chartjs-2"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function ManagerDashboard() {
    const [dashboard, setDashboard] = useState(null)
    const [performance, setPerformance] = useState([])

    const fetchData = async () => {
        const dashRes = await API.get("/dashboard/ceo")
        setDashboard(dashRes.data)

        const perfRes = await API.get("/performance/monthly?month=12&year=2025")
        setPerformance(perfRes.data.results)
    }

    useEffect(() => {
        fetchData()

        // 🔁 AUTO UPDATE EVERY 20 SECONDS
        const interval = setInterval(fetchData, 20000)
        return () => clearInterval(interval)
    }, [])

    if (!dashboard) return <p>Loading...</p>

    const taskChart = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [
                    dashboard.stats.completedTasks,
                    dashboard.stats.pendingTasks
                ],
                backgroundColor: ["#16a34a", "#dc2626"]
            }
        ]
    }

    const performanceChart = {
        labels: performance.map(p => p.name),
        datasets: [
            {
                label: "Performance %",
                data: performance.map(p => p.score),
                backgroundColor: "#2563eb"
            }
        ]
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Manager Team Dashboard</h1>

            {/* KPI CARDS */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow">Employees: {dashboard.stats.totalEmployees}</div>
                <div className="bg-white p-4 shadow">Total Tasks: {dashboard.stats.totalTasks}</div>
                <div className="bg-white p-4 shadow">Completed: {dashboard.stats.completedTasks}</div>
            </div>
            <select onChange={(e) => setMonth(e.target.value)}>
                <option value="12">December</option>
                <option value="11">November</option>
            </select>

            /performance/monthly?month=${month}&year=2025

            {/* TASK STATUS */}
            <div className="bg-white p-4 shadow w-1/2">
                <Pie data={taskChart} />
            </div>

            {/* PERFORMANCE GRAPH */}
            <div className="bg-white p-4 shadow">
                <Bar data={performanceChart} />
            </div>
        </div>
    )
}

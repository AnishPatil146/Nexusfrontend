import { useEffect, useState } from "react"
import API from "../services/api"
import { Bar } from "react-chartjs-2"

export default function CeoDashboard() {
    const [stats, setStats] = useState(null)

    const fetchDashboard = async () => {
        const res = await API.get("/dashboard/ceo")
        setStats(res.data)
    }

    useEffect(() => {
        fetchDashboard()

        // 🔁 AUTO UPDATE EVERY 30 SECONDS
        const interval = setInterval(fetchDashboard, 30000)
        return () => clearInterval(interval)
    }, [])

    if (!stats) return <p>Loading...</p>

    const chartData = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                label: "Tasks",
                data: [
                    stats.stats.completedTasks,
                    stats.stats.pendingTasks
                ],
                backgroundColor: ["#22c55e", "#ef4444"]
            }
        ]
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                {stats.companyName} ({stats.plan})
            </h1>

            {/* KPI CARDS */}
            <div className="grid grid-cols-3 gap-4 my-6">
                <div className="bg-white p-4 shadow">Employees: {stats.stats.totalEmployees}</div>
                <div className="bg-white p-4 shadow">Total Tasks: {stats.stats.totalTasks}</div>
                <div className="bg-white p-4 shadow">Completed: {stats.stats.completedTasks}</div>
            </div>

            {/* GRAPH */}
            <div className="bg-white p-4 shadow">
                <Bar data={chartData} />
            </div>
        </div>
    )
}

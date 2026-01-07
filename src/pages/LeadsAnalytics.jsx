import { useEffect, useState } from "react"
import API from "../services/api"
import socket from "../services/socket"
import { Pie } from "react-chartjs-2"
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function LeadsAnalytics() {
    const [data, setData] = useState(null)

    const fetchAnalytics = () => {
        API.get("/dashboard/leads-analytics").then((res) =>
            setData(res.data)
        )
    }

    useEffect(() => {
        fetchAnalytics()
        socket.on("leadUpdated", fetchAnalytics)

        return () => socket.off("leadUpdated")
    }, [])

    if (!data) return <p className="p-6">Loading...</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Leads Analytics</h1>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <div>Total: {data.totalLeads}</div>
                <div>Converted: {data.convertedLeads}</div>
                <div>Lost: {data.lostLeads}</div>
                <div>Conversion: {data.conversionRate}%</div>
            </div>

            <div className="w-1/2 bg-white p-4 shadow">
                <Pie
                    data={{
                        labels: data.statusStats.map((s) => s._id),
                        datasets: [
                            {
                                data: data.statusStats.map((s) => s.count),
                                backgroundColor: [
                                    "#3b82f6",
                                    "#6366f1",
                                    "#facc15",
                                    "#22c55e",
                                    "#ef4444"
                                ]
                            }
                        ]
                    }}
                />
            </div>
        </div>
    )
}

import { useEffect, useState } from "react"
import API from "../services/api"
import socket from "../services/socket"
import { Pie, Line } from "react-chartjs-2"

export default function EmployeeDashboard() {
    const [tasks, setTasks] = useState([])
    const [performance, setPerformance] = useState(null)

    const fetchData = async () => {
        const taskRes = await API.get("/tasks/my")
        setTasks(taskRes.data.tasks)

        const date = new Date()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const perfRes = await API.get(
            `/performance/monthly?month=${month}&year=${year}`
        )

        const me = perfRes.data.results.find(
            e => e.name === localStorage.getItem("userName")
        )

        setPerformance(me)
    }

    useEffect(() => {
        fetchData()

        // 🔥 REAL-TIME UPDATES
        socket.on("taskUpdated", fetchData)

        return () => socket.off("taskUpdated")
    }, [])

    if (!performance) return <p>Loading...</p>

    const pending = tasks.filter(t => t.status === "Pending").length
    const completed = tasks.filter(t => t.status === "Completed").length

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">My Dashboard</h1>

            {/* KPI */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow">Total Tasks: {tasks.length}</div>
                <div className="bg-white p-4 shadow">Completed: {completed}</div>
                <div className="bg-white p-4 shadow">Rating: {performance.rating}</div>
            </div>

            {/* TASK STATUS GRAPH */}
            <div className="bg-white p-4 shadow w-1/2">
                <Pie
                    data={{
                        labels: ["Pending", "Completed"],
                        datasets: [
                            {
                                data: [pending, completed],
                                backgroundColor: ["#facc15", "#22c55e"]
                            }
                        ]
                    }}
                />
            </div>

            {/* PERFORMANCE GRAPH */}
            <div className="bg-white p-4 shadow">
                <Line
                    data={{
                        labels: ["Performance"],
                        datasets: [
                            {
                                label: "Monthly Score %",
                                data: [performance.score],
                                borderColor: "#3b82f6"
                            }
                        ]
                    }}
                />
            </div>

            {/* TASK LIST */}
            <div className="bg-white p-4 shadow">
                <h2 className="font-bold mb-2">My Tasks</h2>
                {tasks.map(t => (
                    <div key={t._id} className="border-b py-2">
                        {t.title} — <b>{t.status}</b>
                    </div>
                ))}
            </div>
        </div>
    )
}

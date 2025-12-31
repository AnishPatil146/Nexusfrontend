import { useEffect, useState } from "react"
import API from "../services/api"
import { Line } from "react-chartjs-2"

export default function MonthlyPerformanceChart({ month, year }) {
    const [data, setData] = useState([])

    useEffect(() => {
        API.get(`/performance/monthly?month=${month}&year=${year}`)
            .then(res => setData(res.data.results))
    }, [month, year])

    return (
        <Line
            data={{
                labels: data.map(e => e.name),
                datasets: [
                    {
                        label: "Performance %",
                        data: data.map(e => e.score),
                        borderColor: "#3b82f6"
                    }
                ]
            }}
        />
    )
}

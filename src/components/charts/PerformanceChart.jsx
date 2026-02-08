import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import ChartBox from "../ChartBox";

const data = [
    { month: "Jan", value: 70 },
    { month: "Feb", value: 82 },
    { month: "Mar", value: 90 },
    { month: "Apr", value: 85 },
];

export default function PerformanceChart() {
    return (
        <ChartBox title="Performance (%)">
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}

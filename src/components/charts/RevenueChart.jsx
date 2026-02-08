import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import ChartBox from "../ChartBox";

const data = [
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 72000 },
    { month: "Mar", value: 91000 },
];

export default function RevenueChart() {
    return (
        <ChartBox title="Revenue (₹)">
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}

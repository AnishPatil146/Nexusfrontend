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
    { name: "Target", value: 100000 },
    { name: "Achieved", value: 91000 },
];

export default function TargetChart() {
    return (
        <ChartBox title="Target vs Achieved">
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#facc15" />
                </BarChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}

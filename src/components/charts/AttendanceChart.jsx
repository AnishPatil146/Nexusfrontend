import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import ChartBox from "../ChartBox";

const data = [
    { name: "Present", value: 22 },
    { name: "Absent", value: 2 },
];

export default function AttendanceChart() {
    return (
        <ChartBox title="Attendance">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={70}
                        fill="#22c55e"
                        label
                    />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ data }) {
    return (
        <div style={styles.box}>
            <h3 style={styles.title}>Monthly Leads</h3>

            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{
                            background: "#020617",
                            border: "1px solid #1f2937",
                            color: "#e5e7eb",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

const styles = {
    box: {
        marginTop: 40,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1f2937",
        borderRadius: 14,
        padding: 20,
        width: "100%",
        maxWidth: 600,
    },
    title: {
        marginBottom: 16,
        color: "#e5e7eb",
    },
};

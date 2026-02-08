import Chart from "react-apexcharts";

export default function MonthlyPerformanceChart({ data }) {
    const series = [
        {
            name: "Leads",
            data: data.map((m) => m.leads),
        },
    ];

    const options = {
        chart: {
            type: "line",
            height: 300,
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
            },
            background: "transparent",
        },
        theme: {
            mode: "dark",
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        colors: ["#38bdf8"],
        grid: {
            borderColor: "#1f2937",
        },
        xaxis: {
            categories: data.map((m) => m.month),
            labels: { style: { colors: "#9ca3af" } },
        },
        yaxis: {
            labels: { style: { colors: "#9ca3af" } },
        },
        tooltip: {
            theme: "dark",
        },
    };

    return (
        <div
            style={{
                background: "#111827",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #1f2937",
            }}
        >
            <h3 style={{ marginBottom: 10 }}>Monthly Performance</h3>
            <Chart options={options} series={series} type="line" height={280} />
        </div>
    );
}

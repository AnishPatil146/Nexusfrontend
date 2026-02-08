export default function ChartBox({ title, children }) {
    return (
        <div style={styles.card}>
            <h4 style={styles.title}>{title}</h4>
            {children}
        </div>
    );
}

const styles = {
    card: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #1f2937",
        borderRadius: 14,
        padding: 20,
        minHeight: 260,
    },
    title: {
        marginBottom: 12,
        color: "#38bdf8",
    },
};

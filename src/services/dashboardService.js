const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export async function getDashboardAnalytics() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/dashboard/analytics`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to load dashboard");

    return res.json();
}

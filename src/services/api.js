const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export async function apiGet(path, token) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("API Error");
    }

    return res.json();
}

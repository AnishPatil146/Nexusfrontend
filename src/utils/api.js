const API = import.meta.env.VITE_API_BASE_URL

export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    })

    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
}

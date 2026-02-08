import axios from "axios"

const API = import.meta.env.VITE_API_BASE_URL

export const getLeads = async () => {
    const token = localStorage.getItem("token")

    const res = await axios.get(`${API}/leads`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return res.data
}

export const createLead = async (leadData) => {
    const token = localStorage.getItem("token")

    const res = await axios.post(`${API}/leads`, leadData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return res.data
}

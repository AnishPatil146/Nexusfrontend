import API from "./api"

/* GET */
export const getLeads = async () => {
    const res = await API.get("/leads")
    return res.data.leads
}

/* CREATE */
export const createLead = async (data) => {
    const res = await API.post("/leads", data)
    return res.data
}

/* UPDATE */
export const updateLead = async (id, data) => {
    const res = await API.put(`/leads/${id}`, data)
    return res.data
}

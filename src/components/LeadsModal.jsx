import { useState } from "react"
import { createLead } from "../services/leadsService"

export default function LeadModal({ open, onClose, onSuccess }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        status: "New",
    })

    if (!open) return null

    const submit = async () => {
        try {
            await createLead(form)
            onSuccess()
            onClose()
        } catch {
            alert("Failed to create lead")
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="text-xl mb-4">Add Lead</h2>

                <input
                    placeholder="Name"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    placeholder="Email"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <select
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option>New</option>
                    <option>Converted</option>
                    <option>Pending</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

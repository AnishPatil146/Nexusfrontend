import { useEffect, useState } from "react"
import { createLead, updateLead } from "../services/leadsService"

export default function LeadModal({ lead, onClose, onSaved }) {
    const isEdit = Boolean(lead)

    const [form, setForm] = useState({
        name: "",
        email: "",
        status: "New"
    })

    useEffect(() => {
        if (lead) {
            setForm({
                name: lead.name,
                email: lead.email,
                status: lead.status
            })
        }
    }, [lead])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isEdit) {
            await updateLead(lead._id, form)
        } else {
            await createLead(form)
        }

        onSaved()
        onClose()
    }

    const statusFlow = {
        New: ["Contacted"],
        Contacted: ["Qualified", "Lost"],
        Qualified: ["Converted", "Lost"],
        Converted: [],
        Lost: []
    }

const availableStatuses = lead
    ? statusFlow[lead.status]
    : ["New"]

return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? "Update Lead" : "Create Lead"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        placeholder="Name"
                        className="w-full border p-2"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />

                    <input
                        placeholder="Email"
                        className="w-full border p-2"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

<select
    className="w-full border p-2"
    value={form.status}
    onChange={(e) =>
        setForm({ ...form, status: e.target.value })
    }
>
    {availableStatuses.map((status) => (
        <option key={status}>{status}</option>
    ))}
</select>

<div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {isEdit ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

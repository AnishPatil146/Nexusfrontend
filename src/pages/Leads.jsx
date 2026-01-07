import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar.jsx"
import Navbar from "../components/Navbar.jsx"
import LeadModal from "../components/LeadsModal.jsx"

import { getLeads } from "../services/leadsService"
import socket from "../services/socket"

export default function Leads() {
    const [leads, setLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const fetchLeads = async () => {
        const data = await getLeads()
        setLeads(data)
    }

    useEffect(() => {
        fetchLeads()

        socket.on("leadUpdated", fetchLeads)
        return () => socket.off("leadUpdated")
    }, [])

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 bg-gray-100">
                <Navbar />

                <div className="p-6">
                    <div className="flex justify-between mb-4">
                        <h1 className="text-2xl font-bold">Leads</h1>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            + Add Lead
                        </button>
                    </div>

                    <table className="w-full bg-white shadow rounded">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead._id} className="border-t">
                                    <td className="p-4">{lead.name}</td>
                                    <td className="p-4">{lead.email}</td>
                                    <td className="p-4">{lead.status}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            className="text-blue-600"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(openModal || selectedLead) && (
                <LeadModal
                    lead={selectedLead}
                    onClose={() => {
                        setOpenModal(false)
                        setSelectedLead(null)
                    }}
                    onSaved={fetchLeads}
                />
            )}
        </div>
    )
}

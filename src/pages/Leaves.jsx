import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
    Calendar, CheckCircle, XCircle, Plus, User
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Leaves() {
    const { user } = useAuth();
    const isManager = user?.role === "manager" || user?.role === "admin";

    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newLeave, setNewLeave] = useState({ type: "Sick Leave", from: "", to: "", reason: "" });

    // Load Data on Mount & Listen for updates
    useEffect(() => {
        loadLeaves();

        // Listen for changes from NotificationContext actions
        window.addEventListener("storage", loadLeaves);
        return () => window.removeEventListener("storage", loadLeaves);
    }, []);

    const loadLeaves = () => {
        const savedLeaves = JSON.parse(localStorage.getItem("nexus_leaves")) || [];
        setLeaves(savedLeaves);
    };

    // --- APPLY LEAVE (Employee) ---
    const handleApplyLeave = () => {
        if (!newLeave.from || !newLeave.to || !newLeave.reason) return toast.error("Fill all details!");

        const request = {
            id: Date.now(),
            name: user.name,
            type: newLeave.type,
            dates: `${newLeave.from} to ${newLeave.to}`,
            reason: newLeave.reason,
            status: "Pending",
            avatar: user.name.charAt(0).toUpperCase()
        };

        const updatedList = [request, ...leaves];
        setLeaves(updatedList);
        localStorage.setItem("nexus_leaves", JSON.stringify(updatedList));

        setShowModal(false);
        toast.success("Request Sent! Manager will be notified. 📨");
    };

    // --- ACTION (Manager) ---
    const handleAction = (id, status) => {
        const updatedLeaves = leaves.map(l => l.id === id ? { ...l, status: status } : l);
        setLeaves(updatedLeaves);
        localStorage.setItem("nexus_leaves", JSON.stringify(updatedLeaves));

        if (status === "Approved") toast.success(`Leave Approved! ✅`);
        else toast.error(`Leave Rejected! ❌`);
    };

    // Filter View
    const myView = isManager ? leaves : leaves.filter(l => l.name === user.name);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
            default: return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
        }
    };

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                        Leave Management
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {isManager ? "Review & Manage Employee Requests" : "Track & Apply for Leaves"}
                    </p>
                </div>
                {!isManager && (
                    <button onClick={() => setShowModal(true)} className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all">
                        <Plus size={18} /> Apply Leave
                    </button>
                )}
            </div>

            <div className="bg-[#151e32] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1e293b] text-slate-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-5">Employee</th>
                            <th className="p-5">Dates</th>
                            <th className="p-5">Reason</th>
                            <th className="p-5">Status</th>
                            {isManager && <th className="p-5 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {myView.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-500">No leave history found.</td></tr>
                        ) : (
                            myView.map((leave) => (
                                <tr key={leave.id} className="hover:bg-[#1e293b]/50 transition-all">
                                    <td className="p-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shadow-inner">{leave.avatar}</div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{leave.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{leave.type}</p>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-slate-300 font-mono"><Calendar size={14} className="inline mr-1 text-slate-500" /> {leave.dates}</td>
                                    <td className="p-5 text-sm text-slate-400 italic">"{leave.reason}"</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(leave.status)}`}>{leave.status}</span>
                                    </td>
                                    {isManager && (
                                        <td className="p-5 text-right">
                                            {leave.status === "Pending" ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleAction(leave.id, "Approved")} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"><CheckCircle size={18} /></button>
                                                    <button onClick={() => handleAction(leave.id, "Rejected")} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><XCircle size={18} /></button>
                                                </div>
                                            ) : <span className="text-xs text-slate-600 font-bold opacity-50">DECIDED</span>}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Apply for Leave</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Leave Type</label><select value={newLeave.type} onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1"><option>Sick Leave</option><option>Casual Leave</option><option>Emergency Leave</option></select></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-slate-400 uppercase">From</label><input type="date" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1 text-sm" onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} /></div>
                                <div><label className="text-xs font-bold text-slate-400 uppercase">To</label><input type="date" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1 text-sm" onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} /></div>
                            </div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Reason</label><textarea rows="3" placeholder="Explain briefly..." className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1 text-sm" onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}></textarea></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="text-slate-400 font-bold px-4 hover:text-white">Cancel</button><button onClick={handleApplyLeave} className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded-xl">Submit</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
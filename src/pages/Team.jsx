import React, { useState } from "react";
import {
    Users, Briefcase, MoreVertical, TrendingUp, CheckCircle, Search, UserPlus, Bell, X, Send
} from "lucide-react";
import { useNotifications } from "../auth/NotificationContext"; // 👈 CHANGED TO AUTH

export default function Team() {
    const { sendNotification } = useNotifications();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [message, setMessage] = useState("");

    const [employees] = useState([
        { id: 1, name: "Anish Patil", role: "Manager", status: "Active", tasksDone: 45, efficiency: 92, avatar: "A" },
        { id: 2, name: "Rahul Sharma", role: "Developer", status: "Active", tasksDone: 32, efficiency: 85, avatar: "R" },
        { id: 3, name: "Priya Singh", role: "Designer", status: "On Leave", tasksDone: 28, efficiency: 78, avatar: "P" },
        { id: 4, name: "Amit Verma", role: "Sales Exec", status: "Active", tasksDone: 50, efficiency: 96, avatar: "A" },
        { id: 5, name: "Sneha Roy", role: "Intern", status: "Inactive", tasksDone: 10, efficiency: 60, avatar: "S" },
    ]);

    const [filter, setFilter] = useState("All");

    const filteredEmployees = employees.filter(emp => filter === "All" ? true : emp.role === filter);
    const totalEmp = employees.length;
    const activeEmp = employees.filter(e => e.status === "Active").length;
    const avgEfficiency = Math.round(employees.reduce((acc, curr) => acc + curr.efficiency, 0) / totalEmp);

    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "On Leave": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const handleNotifyClick = (emp) => {
        setSelectedMember(emp);
        setMessage("");
        setModalOpen(true);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        sendNotification(selectedMember.name, message);
        setModalOpen(false);
    };

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans relative">
            {/* Header & Stats Code Same as Before... */}
            <div className="flex justify-between items-end mb-8">
                <div><h1 className="text-3xl font-extrabold text-white">Team Overview</h1></div>
                <button className="bg-indigo-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"><UserPlus size={18} /> Add Member</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 flex items-center gap-4"><div className="bg-blue-500/10 p-4 rounded-xl text-blue-400"><Users size={28} /></div><div><p className="text-slate-400 text-xs font-bold uppercase">Total</p><h3 className="text-3xl font-bold">{totalEmp}</h3></div></div>
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 flex items-center gap-4"><div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400"><CheckCircle size={28} /></div><div><p className="text-slate-400 text-xs font-bold uppercase">Active</p><h3 className="text-3xl font-bold">{activeEmp}</h3></div></div>
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 flex items-center gap-4"><div className="bg-yellow-500/10 p-4 rounded-xl text-yellow-400"><TrendingUp size={28} /></div><div><p className="text-slate-400 text-xs font-bold uppercase">Efficiency</p><h3 className="text-3xl font-bold">{avgEfficiency}%</h3></div></div>
            </div>

            <div className="flex justify-between items-center mb-6 bg-[#151e32] p-2 rounded-xl border border-slate-800">
                <div className="flex gap-2">
                    {["All", "Manager", "Developer", "Sales Exec"].map(role => (
                        <button key={role} onClick={() => setFilter(role)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === role ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>{role}</button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-[#0b1120] px-3 py-2 rounded-lg border border-slate-700 mx-2"><Search size={16} className="text-slate-500" /><input placeholder="Search..." className="bg-transparent outline-none text-sm text-white w-40" /></div>
            </div>

            <div className="bg-[#151e32] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1e293b] text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr><th className="p-5">Employee</th><th className="p-5">Role</th><th className="p-5">Status</th><th className="p-5">Performance</th><th className="p-5 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-[#1e293b]/50 transition-all">
                                <td className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">{emp.avatar}</div><div><h4 className="font-bold text-white">{emp.name}</h4><p className="text-xs text-slate-500">ID: 00{emp.id}</p></div></div></td>
                                <td className="p-5"><div className="flex items-center gap-2 text-slate-300 font-medium"><Briefcase size={14} className="text-indigo-400" /> {emp.role}</div></td>
                                <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(emp.status)}`}>{emp.status}</span></td>
                                <td className="p-5 w-1/4"><div className="w-full bg-slate-700 h-2 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${emp.efficiency}%` }}></div></div></td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleNotifyClick(emp)} className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg text-slate-400"><Bell size={18} /></button>
                                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><MoreVertical size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-white">Notify {selectedMember?.name}</h3><button onClick={() => setModalOpen(false)}><X className="text-slate-400" /></button></div>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message..." className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-4 text-white outline-none h-32 mb-4" />
                        <div className="flex justify-end gap-3"><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 font-bold">Cancel</button><button onClick={handleSendMessage} className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-bold flex gap-2"><Send size={16} /> Send</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
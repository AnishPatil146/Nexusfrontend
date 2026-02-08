import React, { useState } from "react";
import {
    Plus, MoreVertical, Phone, Mail, ArrowRight, DollarSign, Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Leads() {
    const [view, setView] = useState("board"); // 'board' or 'list'
    const [showModal, setShowModal] = useState(false);

    // --- MOCK DATA ---
    const [leads, setLeads] = useState([
        { id: 1, name: "Amit Sharma", company: "Tech Solutions", value: "₹50,000", status: "New", email: "amit@tech.com", phone: "+91 98765 43210" },
        { id: 2, name: "Sarah Jenkins", company: "Design Studio", value: "₹1,20,000", status: "Contacted", email: "sarah@design.com", phone: "+1 555 0192" },
        { id: 3, name: "Rajesh Groups", company: "Real Estate", value: "₹5,00,000", status: "Qualified", email: "info@rajesh.com", phone: "+91 99887 76655" },
        { id: 4, name: "StartUp Inc", company: "SaaS Product", value: "₹75,000", status: "New", email: "hello@startup.com", phone: "+91 77665 54433" },
    ]);

    const [newLead, setNewLead] = useState({ name: "", company: "", value: "", status: "New" });

    // --- ACTIONS ---
    const handleAddLead = () => {
        if (!newLead.name || !newLead.company) return toast.error("Name & Company required!");
        const lead = { ...newLead, id: Date.now() };
        setLeads([...leads, lead]);
        setShowModal(false);
        setNewLead({ name: "", company: "", value: "", status: "New" });
        toast.success("Lead Added Successfully! 🚀");
    };

    const moveLead = (id, newStatus) => {
        const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        setLeads(updatedLeads);
        toast.success(`Moved to ${newStatus}`);
    };

    // --- KANBAN COLUMNS ---
    const columns = ["New", "Contacted", "Qualified", "Closed"];

    const getColumnColor = (status) => {
        switch (status) {
            case "New": return "border-blue-500/50 bg-blue-500/10";
            case "Contacted": return "border-amber-500/50 bg-amber-500/10";
            case "Qualified": return "border-purple-500/50 bg-purple-500/10";
            case "Closed": return "border-emerald-500/50 bg-emerald-500/10";
            default: return "border-slate-700 bg-[#1e293b]";
        }
    };

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Leads Pipeline
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your potential clients and deals.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                    <Plus size={18} /> Add New Lead
                </button>
            </div>

            {/* KANBAN BOARD */}
            <div className="flex gap-6 overflow-x-auto pb-8">
                {columns.map((col) => (
                    <div key={col} className="min-w-[300px] flex-1">
                        {/* Column Header */}
                        <div className={`p-4 rounded-xl border-b-4 mb-4 bg-[#151e32] flex justify-between items-center ${getColumnColor(col)}`}>
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">{col}</h3>
                            <span className="bg-[#0b1120] text-xs font-bold px-2 py-1 rounded-md text-slate-400">
                                {leads.filter(l => l.status === col).length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            {leads.filter(l => l.status === col).map((lead) => (
                                <div key={lead.id} className="bg-[#151e32] p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all shadow-lg group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-base">{lead.name}</h4>
                                        <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                                    </div>
                                    <p className="text-xs text-indigo-400 font-bold mb-3">{lead.company}</p>

                                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                                        <div className="flex items-center gap-1"><DollarSign size={12} /> {lead.value || "0"}</div>
                                        <div className="flex items-center gap-1"><Calendar size={12} /> Today</div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-2 border-t border-slate-700 pt-3 mt-2">
                                        <button className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 transition-colors" title="Call">
                                            <Phone size={14} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors" title="Email">
                                            <Mail size={14} />
                                        </button>

                                        {/* Move to Next Stage Button */}
                                        {col !== "Closed" && (
                                            <button
                                                onClick={() => moveLead(lead.id, columns[columns.indexOf(col) + 1])}
                                                className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-indigo-600 px-3 py-2 rounded-lg transition-all"
                                            >
                                                Next <ArrowRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {leads.filter(l => l.status === col).length === 0 && (
                                <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-sm">
                                    No leads here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD LEAD MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Lead</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Client Name</label>
                                <input type="text" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1"
                                    value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Company</label>
                                <input type="text" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1"
                                    value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Deal Value (₹)</label>
                                <input type="text" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1"
                                    value={newLead.value} onChange={e => setNewLead({ ...newLead, value: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                                <select className="w-full bg-[#0b1120] border border-slate-700 rounded-xl p-3 text-white outline-none mt-1"
                                    value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })}
                                >
                                    {columns.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold px-4 hover:text-white">Cancel</button>
                            <button onClick={handleAddLead} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl">Add Lead</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
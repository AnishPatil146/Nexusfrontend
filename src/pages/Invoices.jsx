import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, FileText, Download, Trash2, X, CheckCircle, ShieldCheck, AlertTriangle, LayoutGrid, List } from "lucide-react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// --- 🎨 CUSTOM TOOLTIP (Red Text Logic) ---
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const isOverdue = data.name === "Overdue";
        return (
            <div className="bg-[#1e293b] p-3 rounded-xl border border-slate-700 shadow-xl">
                <p className={`text-sm font-bold ${isOverdue ? "text-red-500" : "text-white"}`}>
                    {data.name} : {data.value}
                </p>
            </div>
        );
    }
    return null;
};

export default function Invoices() {
    const { user } = useAuth();
    const location = useLocation();

    // --- STATE ---
    const [invoices, setInvoices] = useState(() => {
        const saved = localStorage.getItem("crm_invoices_v3");
        return saved ? JSON.parse(saved) : [
            { id: "INV-5001", client: "Rahul Sharma", date: "2025-01-10", amount: 15000, status: "Paid" },
            { id: "INV-5002", client: "Priya Singh", date: "2025-02-02", amount: 8500, status: "Overdue" },
            { id: "INV-5003", client: "Amit Verma", date: "2025-02-14", amount: 45000, status: "Overdue" },
        ];
    });

    const [leads, setLeads] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newInvoice, setNewInvoice] = useState({ client: "", amount: "", date: "", status: "Pending" });
    const [viewMode, setViewMode] = useState("list");

    // PDF State
    const [printData, setPrintData] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        localStorage.setItem("crm_invoices_v3", JSON.stringify(invoices));
    }, [invoices]);

    // Load Leads for Dropdown
    useEffect(() => {
        const savedLeads = localStorage.getItem("crm_leads");
        if (savedLeads) setLeads(JSON.parse(savedLeads));

        if (location.state?.selectedLeadId) {
            const incomingId = location.state.selectedLeadId;
            setShowModal(true);
            if (location.state.selectedLeadName) {
                setNewInvoice(prev => ({ ...prev, client: location.state.selectedLeadName }));
            }
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // --- GRAPHS ---
    const overdueCount = invoices.filter(inv => inv.status === "Overdue").length;
    const isCritical = overdueCount >= 2;

    const pieData = [
        { name: 'Paid', value: invoices.filter(i => i.status === 'Paid').length, color: '#10b981' },
        { name: 'Pending', value: invoices.filter(i => i.status === 'Pending').length, color: '#facc15' },
        { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length, color: '#ef4444' },
    ];

    const totalRevenue = invoices.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const graphData = [
        { name: 'Week 1', value: totalRevenue * 0.4 },
        { name: 'Week 2', value: totalRevenue * 0.6 },
        { name: 'Week 3', value: totalRevenue * 0.3 },
        { name: 'Week 4', value: totalRevenue },
    ];

    // --- HANDLERS ---
    const handleCreate = () => {
        if (!newInvoice.client || !newInvoice.amount) return alert("Fill all details!");

        const invoice = {
            id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
            client: newInvoice.client,
            amount: Number(newInvoice.amount),
            status: newInvoice.status,
            date: newInvoice.date || new Date().toISOString().split('T')[0]
        };
        setInvoices([invoice, ...invoices]);
        setShowModal(false);
        setNewInvoice({ client: "", amount: "", date: "", status: "Pending" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete invoice?")) setInvoices(invoices.filter((inv) => inv.id !== id));
    };

    const handleMarkPaid = (id) => {
        setInvoices(invoices.map((inv) => inv.id === id ? { ...inv, status: "Paid" } : inv));
    };

    const handleDownload = async (inv) => {
        setPrintData(inv);
        setTimeout(async () => {
            if (printRef.current) {
                const canvas = await html2canvas(printRef.current, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
                pdf.save(`Invoice_${inv.id}.pdf`);
                setPrintData(null);
            }
        }, 500);
    };

    const filteredInvoices = invoices.filter(inv => {
        const clientName = typeof inv.client === 'object' ? inv.client.name : inv.client;
        return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getStatusColor = (status) => {
        if (status === "Paid") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (status === "Pending") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        return "bg-red-500/10 text-red-400 border-red-500/20";
    };

    const columns = [
        { title: "Pending", status: "Pending", color: "border-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-400" },
        { title: "Overdue", status: "Overdue", color: "border-red-500", bg: "bg-red-500/10", text: "text-red-400" },
        { title: "Paid", status: "Paid", color: "border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] p-8 text-white font-sans relative overflow-x-hidden">
            <div className="absolute top-[-9999px] left-[-9999px]"><InvoiceTemplate ref={printRef} data={printData} /></div>

            {/* HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold text-indigo-400">Invoices</h1>
                    <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Manage Payments</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#151e32] border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium" />
                    </div>

                    {/* View Toggle */}
                    <div className="bg-slate-800 p-1 rounded-xl flex border border-slate-700">
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400"}`}><List size={20} /></button>
                        <button onClick={() => setViewMode("board")} className={`p-2 rounded-lg ${viewMode === "board" ? "bg-indigo-600 text-white" : "text-slate-400"}`}><LayoutGrid size={20} /></button>
                    </div>

                    {/* 👇 NEW INVOICE BUTTON (Visible to ALL) */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                    >
                        <Plus size={18} className="text-white" /> <span>New Invoice</span>
                    </button>
                </div>
            </div>

            {/* CONDITIONAL GRAPHS */}
            {isCritical ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
                    <div className="md:col-span-2 bg-[#151e32] p-6 rounded-2xl border border-red-500/30 shadow-xl shadow-red-900/10">
                        <div className="flex items-center gap-2 mb-4"><AlertTriangle className="text-red-400" size={20} /><h3 className="font-bold text-red-100">Payment Trends</h3></div>
                        <div className="h-[200px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={graphData}><defs><linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} /><XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} formatter={(val) => `₹${val.toLocaleString()}`} /><Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fill="url(#colorCritical)" /></AreaChart></ResponsiveContainer></div>
                    </div>
                    <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center">
                        <div className="h-[150px] w-full relative"><ResponsiveContainer><PieChart><Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-2xl font-bold text-red-400">{overdueCount}</span></div></div>
                        <p className="text-xs text-red-400 font-bold mt-2 uppercase">Overdue</p>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4"><div className="bg-emerald-500 p-3 rounded-full text-white"><ShieldCheck size={32} /></div><div><h2 className="text-xl font-bold text-white">Financial Health Good</h2><p className="text-emerald-400 text-sm">Less than 2 overdue invoices.</p></div></div>
            )}

            {/* VIEW CONTENT */}
            {viewMode === "list" ? (
                <div className="bg-slate-900/50 border border-slate-700 rounded-3xl overflow-hidden p-6 shadow-xl">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase text-slate-500 bg-white/5 font-bold"><tr><th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-indigo-400 font-bold">{inv.id}</td>
                                    <td className="p-4 font-bold text-white">{typeof inv.client === 'object' ? inv.client.name : inv.client}</td>
                                    <td className="p-4 font-mono">₹{Number(inv.amount).toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleDownload(inv)} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700" title="PDF"><Download size={16} /></button>
                                        <button onClick={() => handleDelete(inv.id)} className="bg-slate-800 p-2 rounded-lg hover:text-red-400"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-10">
                    {columns.map((col) => (
                        <div key={col.status} className="flex-1 min-w-[300px]">
                            <div className={`p-4 rounded-xl border-b-4 ${col.color} bg-[#151e32] mb-4 flex justify-between`}><h3>{col.title}</h3><span>{invoices.filter(i => i.status === col.status).length}</span></div>
                            <div className="space-y-4">
                                {invoices.filter(i => i.status === col.status).map((inv) => (
                                    <div key={inv.id} className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50">
                                        <div className="flex justify-between mb-3"><span className="text-xs">{inv.id}</span><h4>{typeof inv.client === 'object' ? inv.client.name : inv.client}</h4></div>
                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                                            <button onClick={() => handleDownload(inv)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-xs font-bold">PDF</button>
                                            {inv.status !== "Paid" && <button onClick={() => handleMarkPaid(inv.id)} className="flex-1 bg-emerald-600/20 text-emerald-400 py-2 rounded-lg text-xs font-bold">Paid</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1e293b] p-8 rounded-3xl w-full max-w-md border border-slate-700 relative">
                        <button onClick={() => setShowModal(false)} className="absolute right-5 top-5 text-slate-400 hover:text-white"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-white mb-6">Create Invoice</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Client</label>
                                <select className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl text-white mt-1" value={newInvoice.client} onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}>
                                    <option value="">-- Select Client --</option>
                                    {/* 🛠️ Dropdown Leads ko render karega, nahi to Custom Name */}
                                    {leads.map(lead => <option key={lead.id} value={lead.name}>{lead.name}</option>)}
                                </select>
                            </div>
                            <input type="number" className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-xl text-white" placeholder="Amount" value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl text-white [color-scheme:dark]" value={newInvoice.date} onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })} />
                                <select className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl text-white" value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}>
                                    <option value="Pending">Pending ⏳</option><option value="Paid">Paid ✅</option><option value="Overdue">Overdue ⚠️</option>
                                </select>
                            </div>
                            <button onClick={handleCreate} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white mt-4">Generate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
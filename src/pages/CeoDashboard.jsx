import React, { useEffect, useState } from "react";
import {
    Users, TrendingUp, DollarSign, BarChart2, PieChart as PieIcon,
    Crown, Activity, ArrowUpRight, Target, Layers, Download,
    AlertTriangle, CheckCircle, Clock, MessageSquare
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// --- 🛠️ HELPER COMPONENTS ---

// 1. Tooltip for Graphs
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 shadow-xl">
                <p className="text-sm font-bold" style={{ color: data.payload.fill || data.color || '#fff' }}>
                    {data.name} : {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                </p>
            </div>
        );
    }
    return null;
};

// 2. KPI Card
const KPICard = ({ title, value, icon, color, bg, subtext, trendUp }) => (
    <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all">
        <div className={`absolute top-0 right-0 p-4 rounded-bl-3xl ${bg} ${color} transition-all group-hover:scale-110`}>
            {icon}
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-extrabold text-white mb-2">{value}</h3>
        <div className="flex items-center gap-2">
            {trendUp ? <ArrowUpRight size={14} className="text-emerald-400" /> : <Activity size={14} className="text-blue-400" />}
            <span className="text-xs text-slate-500 font-medium">{subtext}</span>
        </div>
    </div>
);

// 3. Risk Radar Component (New)
const RiskRadar = () => {
    const risks = [
        { id: 1, type: "Invoice", msg: "Invoice #102 Overdue", value: "₹45k", critical: true },
        { id: 2, type: "Project", msg: "TechCorp Site Delayed", value: "2 Days", critical: true },
        { id: 3, type: "Budget", msg: "Ads Budget Limit", value: "90%", critical: false },
    ];

    return (
        <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl h-full">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-white">
                <AlertTriangle className="text-red-400" /> Risk Radar
            </h3>
            <div className="space-y-4">
                {risks.map((risk) => (
                    <div key={risk.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0b1120] border border-slate-700/50 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${risk.critical ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">{risk.msg}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{risk.type}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${risk.critical ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {risk.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. Activity Feed Component (New)
const ActivityFeed = () => {
    const activities = [
        { id: 1, user: "Anish P.", action: "closed deal", target: "Autovate", time: "2m ago", icon: <CheckCircle size={14} className="text-emerald-400" /> },
        { id: 2, user: "System", action: "payment recvd", target: "Inv #1089", time: "1h ago", icon: <DollarSign size={14} className="text-blue-400" /> },
        { id: 3, user: "Rahul S.", action: "updated lead", target: "TechStart", time: "3h ago", icon: <ArrowUpRight size={14} className="text-purple-400" /> },
    ];

    return (
        <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl h-full">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-white">
                <Clock className="text-indigo-400" /> Live Pulse
            </h3>
            <div className="relative border-l-2 border-slate-700 ml-3 space-y-6">
                {activities.map((act) => (
                    <div key={act.id} className="ml-6 relative">
                        <div className="absolute -left-[31px] top-1 bg-[#151e32] p-1 rounded-full border border-slate-700">
                            {act.icon}
                        </div>
                        <p className="text-sm text-slate-300 leading-tight">
                            <span className="font-bold text-white">{act.user}</span> {act.action} <span className="font-bold text-indigo-400">{act.target}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{act.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 👔 MAIN CEO DASHBOARD COMPONENT ---
export default function CEODashboard() {
    const [timeRange, setTimeRange] = useState("Month");
    const [stats, setStats] = useState({ revenue: 0, profit: 0, pipeline: 0, conversionRate: 0 });
    const [revenueChart, setRevenueChart] = useState([]);
    const [funnelData, setFunnelData] = useState([]);
    const [serviceMix, setServiceMix] = useState([]);
    const [topEmployees, setTopEmployees] = useState([]);

    useEffect(() => {
        // 1. DATA FETCH
        const invoices = JSON.parse(localStorage.getItem("crm_invoices_v3") || "[]");
        const leads = JSON.parse(localStorage.getItem("crm_leads") || "[]");
        const tasks = JSON.parse(localStorage.getItem("crm_tasks") || "[]");

        // 2. FINANCIAL CALCULATIONS
        const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((acc, curr) => acc + Number(curr.amount), 0);
        const pipelineValue = leads.filter(l => l.status !== "Closed").reduce((acc, curr) => acc + Number(curr.value), 0);
        const profit = totalRevenue * 0.65; // 65% Margin

        const wonLeads = leads.filter(l => l.status === "Closed").length;
        const conversion = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : 0;

        setStats({ revenue: totalRevenue, profit, pipeline: pipelineValue, conversionRate: conversion });

        // 3. GRAPH DATA (Mock Distribution)
        const base = totalRevenue / 5 || 10000;
        setRevenueChart([
            { name: 'Jan', revenue: base * 0.5, target: base * 0.8 },
            { name: 'Feb', revenue: base * 0.8, target: base * 0.9 },
            { name: 'Mar', revenue: base * 1.2, target: base * 1.0 },
            { name: 'Apr', revenue: base * 0.9, target: base * 1.1 },
            { name: 'May', revenue: totalRevenue, target: base * 1.2 },
        ]);

        // 4. FUNNEL DATA
        const funnel = { New: 0, Contacted: 0, Qualified: 0, Closed: 0 };
        leads.forEach(l => funnel[l.status] ? funnel[l.status]++ : funnel[l.status] = 1);
        setFunnelData([
            { name: 'New Leads', value: funnel.New, fill: '#6366f1' },
            { name: 'Contacted', value: funnel.Contacted, fill: '#3b82f6' },
            { name: 'Qualified', value: funnel.Qualified, fill: '#eab308' },
            { name: 'Won Deals', value: funnel.Closed, fill: '#10b981' },
        ]);

        // 5. SERVICE MIX
        setServiceMix([
            { name: 'Web Dev', value: totalRevenue * 0.6, color: '#8b5cf6' },
            { name: 'Marketing', value: totalRevenue * 0.25, color: '#f43f5e' },
            { name: 'Support', value: totalRevenue * 0.15, color: '#10b981' },
        ]);

        // 6. LEADERBOARD
        const empPerf = {};
        tasks.forEach(t => { if (t.status === "Done" && t.assignee) empPerf[t.assignee] = (empPerf[t.assignee] || 0) + 1; });
        setTopEmployees(Object.keys(empPerf).map(k => ({ name: k, score: empPerf[k] })).sort((a, b) => b.score - a.score).slice(0, 3));

    }, [timeRange]);

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans overflow-y-auto">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">CEO Analytics</h1>
                    <p className="text-slate-400 mt-2 font-medium">Real-time Business Intelligence</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="bg-[#151e32] hover:bg-[#1e293b] text-slate-300 px-4 py-2 rounded-xl border border-slate-700 font-bold flex items-center gap-2 transition-all">
                        <Download size={18} /> Report
                    </button>
                    <div className="bg-[#151e32] p-1 rounded-xl border border-slate-700 flex">
                        <button onClick={() => setTimeRange("Month")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === "Month" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>Monthly</button>
                        <button onClick={() => setTimeRange("Year")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === "Year" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>Yearly</button>
                    </div>
                </div>
            </div>

            {/* 1. KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<DollarSign />} color="text-emerald-400" bg="bg-emerald-500/10" subtext="+12% Growth" trendUp={true} />
                <KPICard title="Est. Profit (65%)" value={`₹${stats.profit.toLocaleString()}`} icon={<Activity />} color="text-blue-400" bg="bg-blue-500/10" subtext="Healthy Margin" trendUp={true} />
                <KPICard title="Active Pipeline" value={`₹${stats.pipeline.toLocaleString()}`} icon={<Layers />} color="text-purple-400" bg="bg-purple-500/10" subtext="Potential Deals" trendUp={false} />
                <KPICard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={<Target />} color="text-amber-400" bg="bg-amber-500/10" subtext="Leads to Won" trendUp={true} />
            </div>

            {/* 2. MAIN CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-xl flex items-center gap-2"><TrendingUp className="text-indigo-400" /> Financial Performance</h3></div>
                    <div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueChart}><defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} /><XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} /><YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fill="url(#colorRev)" /><Area type="monotone" dataKey="target" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" fill="transparent" /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><BarChart2 className="text-blue-400" /> Sales Funnel</h3>
                    <div className="h-[320px] flex flex-col justify-center"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={funnelData} barSize={24}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} /> <Bar dataKey="value" radius={[0, 4, 4, 0]}>{funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
                </div>
            </div>

            {/* 3. OPERATIONS CENTER (Risk & Feed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <RiskRadar />
                <ActivityFeed />
            </div>

            {/* 4. BOTTOM SECTION (Sources & Team) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><PieIcon className="text-pink-400" /> Revenue Sources</h3>
                    <div className="flex items-center"><div className="h-[250px] w-1/2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={serviceMix} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{serviceMix.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></ResponsiveContainer></div><div className="w-1/2 space-y-4">{serviceMix.map((item, i) => (<div key={i}><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">{item.name}</span><span className="font-bold text-white">₹{item.value.toLocaleString()}</span></div><div className="w-full bg-slate-700 h-1.5 rounded-full"><div className="h-full rounded-full" style={{ width: '60%', backgroundColor: item.color }}></div></div></div>))}</div></div>
                </div>
                <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Crown className="text-yellow-400" /> Star Performers</h3>
                    <div className="space-y-4">{topEmployees.map((emp, i) => (<div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b1120] border border-slate-700/50"><div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${i === 0 ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-slate-700 text-white'}`}>{i + 1}</div><div className="flex-1"><h4 className="font-bold text-white text-lg">{emp.name}</h4><p className="text-xs text-slate-400">Task Efficiency: 9{9 - i}%</p></div><div className="text-right"><span className="block font-bold text-indigo-400">{emp.score} Tasks</span><span className="text-[10px] text-slate-500">Completed</span></div></div>))}</div>
                </div>
            </div>
        </div>
    );
}
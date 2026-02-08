import React, { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie
} from 'recharts';
import {
    Info, X, Users, Activity, TrendingUp, CheckCircle, Clock, Zap, Calendar
} from "lucide-react";

export default function Performance() {
    const [selected, setSelected] = useState(null);

    // --- MOCK DATA ---
    const kpiData = [
        { title: "Avg Efficiency", value: "92%", change: "+4.5%", icon: <Zap size={20} />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { title: "Active Projects", value: "14", change: "+2", icon: <Activity size={20} />, color: "text-blue-400", bg: "bg-blue-400/10" },
        { title: "Tasks Completed", value: "128", change: "+12%", icon: <CheckCircle size={20} />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { title: "Hours Logged", value: "1,240", change: "-1.2%", icon: <Clock size={20} />, color: "text-purple-400", bg: "bg-purple-400/10" },
    ];

    const barData = [
        { name: 'Web Dev', efficiency: 88, members: 'Anish, Rahul', health: 'Excellent', fill: '#6366f1' },
        { name: 'Marketing', efficiency: 65, members: 'Priya, Sneha', health: 'At Risk', fill: '#f43f5e' },
        { name: 'Sales', efficiency: 72, members: 'Amit, Raj', health: 'Good', fill: '#f59e0b' },
        { name: 'Managers', efficiency: 95, members: 'Ankita', health: 'Strong', fill: '#10b981' }
    ];

    const trendData = [
        { name: 'Mon', value: 40 }, { name: 'Tue', value: 60 }, { name: 'Wed', value: 55 },
        { name: 'Thu', value: 85 }, { name: 'Fri', value: 70 }, { name: 'Sat', value: 90 }, { name: 'Sun', value: 65 }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-xl">
                    <p className="text-slate-300 text-sm font-bold mb-1">{label}</p>
                    <p className="text-white text-lg font-bold">
                        Efficiency: <span className="text-indigo-400">{payload[0].value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans overflow-x-hidden">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Performance Insights
                    </h1>
                    <p className="text-slate-400 mt-1">Real-time analytics & team efficiency metrics.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#151e32] hover:bg-[#1e293b] px-4 py-2 rounded-xl border border-slate-700 text-sm font-bold text-slate-300 transition-all">
                    <Calendar size={16} /> Last 30 Days
                </button>
            </div>

            {/* --- KPI CARDS ROW (Fill Empty Space) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiData.map((item, index) => (
                    <div key={index} className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl hover:translate-y-[-2px] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                {item.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.change.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {item.change}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.title}</h3>
                        <p className="text-3xl font-black text-white mt-1">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* --- MAIN CHARTS SECTION (Grid Layout) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* LEFT: Main Bar Chart (Interactive) */}
                <div className="lg:col-span-2 bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-indigo-400" size={20} /> Department Efficiency
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            <span className="text-xs text-slate-400">Active</span>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} onClick={(e) => e && e.activePayload && setSelected(e.activePayload[0].payload)}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#4338ca" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                {/* Gradient Bars */}
                                <Bar dataKey="efficiency" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={50}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} className="cursor-pointer hover:opacity-80 transition-all" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-4 italic">Click on any bar to view team details</p>
                </div>

                {/* RIGHT: Weekly Trend (Area Chart) */}
                <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Weekly Velocity</h3>
                        <p className="text-slate-400 text-sm mb-6">Overall task completion rate</p>
                    </div>

                    <div className="h-[200px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Peak Performance</span>
                            <span className="text-white font-bold">Saturday</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DRILL DOWN MODAL (Existing Feature, Better Look) --- */}
            {selected && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[32px] w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>

                        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
                            <span className="w-3 h-8 rounded-full" style={{ backgroundColor: selected.fill }}></span>
                            {selected.name}
                        </h2>
                        <p className="text-slate-400 text-sm ml-6 mb-8">Performance Breakdown</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0b1120] p-5 rounded-2xl border border-white/5">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Efficiency Score</p>
                                <p className="text-3xl font-black text-white">{selected.efficiency}%</p>
                            </div>
                            <div className="bg-[#0b1120] p-5 rounded-2xl border border-white/5">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Health Status</p>
                                <p className={`text-xl font-bold ${selected.health === 'At Risk' ? 'text-red-400' : 'text-emerald-400'}`}>{selected.health}</p>
                            </div>
                            <div className="col-span-2 bg-[#0b1120] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400"><Users size={20} /></div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase">Team Members</p>
                                    <p className="text-white font-medium">{selected.members}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
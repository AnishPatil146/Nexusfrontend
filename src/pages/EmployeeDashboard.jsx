import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Clock, Calendar, ArrowUpRight, CheckSquare, X, Plane, TrendingUp
} from "lucide-react";

export default function EmployeeDashboard({ user }) {
    const navigate = useNavigate();
    const [showAllTasks, setShowAllTasks] = useState(false);

    // --- HARDCODED DATA (To avoid empty state) ---
    const myTasks = [
        { id: 101, title: "Fix Navbar Responsiveness", due: "Today, 5:00 PM", priority: "High", status: "Pending" },
        { id: 102, title: "Submit Project Report", due: "Tomorrow, 10:00 AM", priority: "Medium", status: "Pending" },
        { id: 103, title: "Client Meeting Preparation", due: "Wed, 2:00 PM", priority: "High", status: "Pending" },
        { id: 104, title: "Update API Documentation", due: "Friday", priority: "Low", status: "Completed" },
        { id: 105, title: "Team Sync", due: "Daily", priority: "Medium", status: "Completed" }
    ];

    const pendingTasks = myTasks.filter(t => t.status !== "Completed");

    const graphData = [
        { day: 'Mon', val: 65 }, { day: 'Tue', val: 59 }, { day: 'Wed', val: 80 },
        { day: 'Thu', val: 81 }, { day: 'Fri', val: 56 }, { day: 'Sat', val: 55 },
        { day: 'Sun', val: 40 }
    ];

    return (
        <div className="p-6 md:p-8 min-h-screen bg-[#0b1120] text-white font-sans">

            {/* --- HEADER SECTION --- */}
            <div className="mb-8 mt-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    My Workspace
                </h1>
                <p className="text-slate-400 mt-2 text-lg">
                    Welcome back, <span className="text-indigo-400 font-bold">{user?.name || "Rahul Team"}</span> 👋
                </p>
            </div>

            {/* --- ✈️ LEAVE BANNER (Fixed Design) --- */}
            <div className="mb-8 relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-r from-[#1e1320] via-[#2a121d] to-[#1e1320] p-6 md:p-8 shadow-lg">
                {/* Background Glow Effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-600/20 rounded-full blur-[80px]"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-600/30">
                            <Plane size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Need a Break? 🌴</h3>
                            <p className="text-rose-200/70 text-sm md:text-base">
                                Check your leave balance or apply for a new leave request instantly.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/leaves')}
                        className="w-full md:w-auto bg-rose-600 hover:bg-rose-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Go to Leaves <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>

            {/* --- MAIN GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📊 WEEKLY PERFORMANCE GRAPH */}
                <div className="lg:col-span-2 bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                            <TrendingUp size={20} className="text-indigo-400" /> Weekly Activity
                        </h3>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.08} vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 📝 TODAY'S FOCUS (TASK LIST) */}
                <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                            <Calendar size={20} className="text-amber-400" /> Today's Focus
                        </h3>
                        <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                            {pendingTasks.length} Pending
                        </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                        {pendingTasks.map((t) => (
                            <div key={t.id} className={`bg-[#0b1120] p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group relative overflow-hidden`}>
                                {/* Priority Indicator Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.priority === 'High' ? 'bg-rose-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>

                                <div className="pl-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${t.priority === 'High' ? 'text-rose-400' : t.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                                            {t.priority} Priority
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">{t.title}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium"><Clock size={12} /> Due: {t.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowAllTasks(true)} className="mt-5 w-full py-3.5 bg-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 shadow-sm">
                        View All Tasks
                    </button>
                </div>
            </div>

            {/* MODAL FOR ALL TASKS */}
            {showAllTasks && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-[#151e32]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2"><CheckSquare size={20} /> All Tasks</h2>
                            <button onClick={() => setShowAllTasks(false)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-5 max-h-[400px] overflow-y-auto space-y-3 custom-scrollbar">
                            {myTasks.map(t => (
                                <div key={t.id} className="flex justify-between items-center bg-[#0b1120] p-4 rounded-xl border border-slate-700">
                                    <div>
                                        <h4 className={`font-bold text-sm mb-0.5 ${t.status === 'Completed' ? 'text-slate-500 line-through decoration-slate-600' : 'text-white'}`}>{t.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{t.due}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border ${t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
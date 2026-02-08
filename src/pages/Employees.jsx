import React, { useState, useEffect } from "react";
import {
    AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Clock, CheckCircle, Target, Award, Calendar, ArrowUpRight, CheckSquare, X, TrendingUp
} from "lucide-react";

export default function EmployeeDashboard({ user }) {
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    useEffect(() => {
        // 1. LocalStorage se data uthao
        const localTasks = JSON.parse(localStorage.getItem("nexus_tasks")) || [];
        const userTasks = localTasks.filter(t => t.assignedTo === user.name);

        // 2. 🔥 FORCE DATA (Agar LocalStorage khali hai toh ye Dummy Data dikhega hi dikhega)
        if (userTasks.length === 0) {
            setMyTasks([
                { id: 101, title: "Fix Navbar Bug", due: "Today, 5 PM", priority: "High", status: "Pending" },
                { id: 102, title: "Submit Weekly Report", due: "Tomorrow, 10 AM", priority: "Medium", status: "Pending" },
                { id: 103, title: "Client Update Email", due: "Wed, 2 PM", priority: "Low", status: "Pending" },
                { id: 104, title: "Update Documentation", due: "Friday", priority: "Medium", status: "Completed" }
            ]);
        } else {
            setMyTasks(userTasks);
        }
    }, [user.name]);

    const pendingTasks = myTasks.filter(t => t.status !== "Completed");
    const completedCount = myTasks.filter(t => t.status === "Completed").length;

    // Graph Data (Static for Visuals)
    const graphData = [
        { day: 'Mon', val: 3 }, { day: 'Tue', val: 5 }, { day: 'Wed', val: 2 },
        { day: 'Thu', val: 7 }, { day: 'Fri', val: 6 }, { day: 'Sat', val: 4 },
    ];

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Workspace</h1>
                <p className="text-slate-400">Welcome, <span className="font-bold text-white">{user?.name}</span> 👋</p>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#151e32] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400"><Award size={20} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Efficiency</p><h3 className="text-2xl font-bold">94%</h3></div>
                </div>
                <div className="bg-[#151e32] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Target size={20} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Assigned</p><h3 className="text-2xl font-bold">{myTasks.length}</h3></div>
                </div>
                <div className="bg-[#151e32] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400"><Clock size={20} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Pending</p><h3 className="text-2xl font-bold">{pendingTasks.length}</h3></div>
                </div>
                <div className="bg-[#151e32] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle size={20} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Done</p><h3 className="text-2xl font-bold">{completedCount}</h3></div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* WEEKLY PERFORMANCE GRAPH */}
                <div className="lg:col-span-2 bg-[#151e32] p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-400" /> Weekly Performance</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData}>
                                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fill="url(#g1)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 🔥 TODAY'S FOCUS (TASK LIST) - AB KABHI EMPTY NAHI DIKHEGA */}
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <Calendar size={18} className="text-amber-400" /> Today's Focus
                    </h3>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {/* Yahan maine logic change kiya hai: Agar 0 tasks hain toh bhi "Demo" dikhao */}
                        {pendingTasks.map((t) => (
                            <div key={t.id} className={`bg-[#0b1120] p-4 rounded-xl border-l-4 ${t.priority === 'High' ? 'border-red-500' : t.priority === 'Medium' ? 'border-yellow-500' : 'border-blue-500'} border-t border-r border-b border-slate-700/50 hover:bg-[#1e293b] transition-all cursor-pointer group`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${t.priority === 'High' ? 'text-red-400' : t.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                        {t.priority} Priority
                                    </span>
                                    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="font-bold text-sm text-white mb-1">{t.title}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> Due: {t.due}</p>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowAllTasks(true)} className="mt-4 w-full py-3 bg-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700">
                        View All Tasks
                    </button>
                </div>
            </div>

            {/* MODAL FOR ALL TASKS */}
            {showAllTasks && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#151e32]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2"><CheckSquare size={18} /> All Tasks</h2>
                            <button onClick={() => setShowAllTasks(false)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                            {myTasks.map(t => (
                                <div key={t.id} className="flex justify-between items-center bg-[#0b1120] p-3 rounded-xl border border-slate-700">
                                    <div>
                                        <h4 className={`font-bold text-sm ${t.status === 'Completed' ? 'text-slate-500 line-through' : 'text-white'}`}>{t.title}</h4>
                                        <p className="text-xs text-slate-500">{t.due}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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
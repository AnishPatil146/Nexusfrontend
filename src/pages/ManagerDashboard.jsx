import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users, CheckCircle, Clock, AlertCircle, TrendingUp, Download, Calendar, ArrowUp, ArrowDown
} from "lucide-react";
import {
    AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';

export default function ManagerDashboard({ user }) {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("This Week");
    const [dashboardData, setDashboardData] = useState(null);

    // --- DATA SETS (Simulating Database) ---
    const dataSets = {
        "This Week": {
            stats: [
                { title: "Team Velocity", value: "124", trend: "+12%", isPositive: true, icon: <TrendingUp />, color: "from-blue-500 to-indigo-500" },
                { title: "Active Tasks", value: "45", trend: "-5%", isPositive: false, icon: <Clock />, color: "from-amber-500 to-orange-500" },
                { title: "Pending Review", value: "8", trend: "+2%", isPositive: false, icon: <AlertCircle />, color: "from-rose-500 to-pink-500" },
                { title: "Completed", value: "1.2k", trend: "+8%", isPositive: true, icon: <CheckCircle />, color: "from-emerald-500 to-teal-500" },
            ],
            productivity: [
                { name: 'Mon', Completed: 12, Review: 4 }, { name: 'Tue', Completed: 19, Review: 3 },
                { name: 'Wed', Completed: 15, Review: 8 }, { name: 'Thu', Completed: 22, Review: 2 },
                { name: 'Fri', Completed: 28, Review: 5 }, { name: 'Sat', Completed: 10, Review: 1 },
            ],
            distribution: [
                { name: 'Dev', value: 45 }, { name: 'Test', value: 25 }, { name: 'Design', value: 20 }, { name: 'Marketing', value: 10 }
            ]
        },
        "Last Month": { // 🔥 BIGGER NUMBERS FOR MONTH VIEW
            stats: [
                { title: "Team Velocity", value: "540", trend: "+24%", isPositive: true, icon: <TrendingUp />, color: "from-blue-500 to-indigo-500" },
                { title: "Active Tasks", value: "120", trend: "+15%", isPositive: true, icon: <Clock />, color: "from-amber-500 to-orange-500" },
                { title: "Pending Review", value: "34", trend: "-10%", isPositive: true, icon: <AlertCircle />, color: "from-rose-500 to-pink-500" },
                { title: "Completed", value: "4.8k", trend: "+32%", isPositive: true, icon: <CheckCircle />, color: "from-emerald-500 to-teal-500" },
            ],
            productivity: [
                { name: 'Week 1', Completed: 120, Review: 40 }, { name: 'Week 2', Completed: 190, Review: 30 },
                { name: 'Week 3', Completed: 150, Review: 80 }, { name: 'Week 4', Completed: 220, Review: 20 },
            ],
            distribution: [
                { name: 'Dev', value: 60 }, { name: 'Test', value: 15 }, { name: 'Design', value: 15 }, { name: 'Marketing', value: 10 }
            ]
        }
    };

    // Load Initial Data
    useEffect(() => {
        setDashboardData(dataSets[timeRange]);
    }, [timeRange]);

    // --- ACTIONS ---
    const handleDownloadReport = () => {
        const wb = XLSX.utils.book_new();
        const ws_data = [
            ["Metric", "Value", "Trend"],
            ...dashboardData.stats.map(s => [s.title, s.value, s.trend])
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Manager_Summary");
        XLSX.writeFile(wb, `Manager_Report_${timeRange.replace(" ", "_")}.xlsx`);
        toast.success("Report Downloaded! 🚀");
    };

    const handleNavigateToReview = () => {
        toast("Redirecting to Task Board...", { icon: "✈️" });
        setTimeout(() => navigate('/tasks'), 500);
    };

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

    if (!dashboardData) return <div>Loading...</div>;

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans animate-in fade-in duration-500">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Manager Overview
                    </h1>
                    <p className="text-slate-400 mt-1">Lead: <span className="text-white font-bold">{user?.name}</span></p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-[#151e32] flex items-center px-4 py-2 rounded-xl border border-slate-700">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-transparent outline-none text-sm font-bold text-white cursor-pointer"
                            style={{ colorScheme: "dark" }}
                        >
                            <option value="This Week">This Week</option>
                            <option value="Last Month">Last Month</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDownloadReport}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Download size={18} /> Export
                    </button>
                </div>
            </div>

            {/* --- STAT CARDS (Dynamic) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardData.stats.map((stat, index) => (
                    <div key={index} className="bg-[#151e32] p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-600 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-all`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {stat.isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {stat.trend}
                            </span>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CHARTS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Team Productivity Chart */}
                <div className="lg:col-span-2 bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Team Productivity</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData.productivity} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Legend />
                                <Bar dataKey="Completed" name="Tasks Done" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Review" name="Needs Review" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Velocity Trend Area Chart */}
                <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2">Velocity Trend</h3>
                    <div className="h-[250px] w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboardData.productivity}>
                                <defs>
                                    <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={3} fill="url(#colorVel)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-400">Peak Velocity</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            {timeRange === "This Week" ? "28 Tasks/day" : "220 Tasks/week"}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- ACTIONABLE ALERTS --- */}
            <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    📢 Needs Attention
                </h3>
                <div className="space-y-3">
                    {/* Alert 1: Actionable */}
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-rose-500/15 transition-all">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-rose-400 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-rose-400 text-sm">Design Review Pending</h4>
                                <p className="text-xs text-rose-200/70 mt-1">3 tasks in "Design" phase are waiting for your approval since 2 days.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleNavigateToReview}
                            className="ml-auto bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                        >
                            Review
                        </button>
                    </div>

                    {/* Alert 2: Info */}
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                        <Clock className="text-amber-400 shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-400 text-sm">Sprint Deadline Approaching</h4>
                            <p className="text-xs text-amber-200/70 mt-1">5 days left in current sprint. 12 tasks still in backlog.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
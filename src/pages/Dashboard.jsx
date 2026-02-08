import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users, TrendingUp, Clock, AlertTriangle, DollarSign,
    BarChart2, PieChart as PieIcon, Crown, Activity,
    ArrowUpRight, ArrowDownRight, Bell
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../auth/ToastContext";

// --- 🛠️ HELPER COMPONENTS (Shared) ---

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 shadow-xl">
                <p className="text-sm font-bold" style={{ color: data.payload.color || data.color || '#fff' }}>
                    {data.name} : {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                </p>
            </div>
        );
    }
    return null;
};

const KPICard = ({ title, value, icon, color, bg, trend, trendUp }) => (
    <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all">
        <div className={`absolute top-0 right-0 p-4 rounded-bl-3xl ${bg} ${color} transition-all group-hover:scale-110`}>
            {icon}
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-extrabold text-white mb-4">{value}</h3>
        {trend && (
            <div className="flex items-center gap-1 text-xs font-bold">
                {trendUp === true && <ArrowUpRight size={14} className="text-emerald-400" />}
                {trendUp === false && <ArrowDownRight size={14} className="text-red-400" />}
                <span className={trendUp === true ? "text-emerald-400" : trendUp === false ? "text-red-400" : "text-slate-500"}>
                    {trend}
                </span>
            </div>
        )}
    </div>
);

// --- 👔 CEO DASHBOARD COMPONENT (The Boss View) ---
const CEODashboard = () => {
    const [timeRange, setTimeRange] = useState("All");
    const [stats, setStats] = useState({ revenue: 0, profit: 0, target: 5000000, percentage: 0 });
    const [topEmployees, setTopEmployees] = useState([]);
    const [revenueTrend, setRevenueTrend] = useState([]);
    const [recentBigDeals, setRecentBigDeals] = useState([]);

    useEffect(() => {
        const invoices = JSON.parse(localStorage.getItem("crm_invoices_v3") || "[]");
        const tasks = JSON.parse(localStorage.getItem("crm_tasks") || "[]");

        // 🕒 DATE FILTER
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filteredInvoices = invoices.filter(inv => {
            if (timeRange === "All") return true;
            const invDate = new Date(inv.date);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        // 💰 FINANCIALS
        const revenue = filteredInvoices.filter(i => i.status === "Paid").reduce((acc, curr) => acc + Number(curr.amount), 0);
        const profit = revenue * 0.70;
        const percentage = Math.min((revenue / stats.target) * 100, 100);

        setStats(prev => ({ ...prev, revenue, profit, percentage }));

        // 🏆 LEADERBOARD
        const employeePerf = {};
        tasks.forEach(task => {
            if (task.status === "Done" && task.assignee) {
                employeePerf[task.assignee] = (employeePerf[task.assignee] || 0) + 1;
            }
        });
        setTopEmployees(Object.keys(employeePerf).map(name => ({ name, tasks: employeePerf[name] })).sort((a, b) => b.tasks - a.tasks).slice(0, 3));

        // 📈 DYNAMIC TREND
        if (timeRange === "All") {
            setRevenueTrend([
                { name: 'Jan', value: revenue * 0.2 }, { name: 'Feb', value: revenue * 0.4 },
                { name: 'Mar', value: revenue * 0.6 }, { name: 'Apr', value: revenue * 0.8 }, { name: 'May', value: revenue }
            ]);
        } else {
            setRevenueTrend([
                { name: 'W1', value: revenue * 0.1 }, { name: 'W2', value: revenue * 0.3 },
                { name: 'W3', value: revenue * 0.7 }, { name: 'W4', value: revenue }
            ]);
        }

        // 🤝 BIG DEALS
        setRecentBigDeals(invoices.sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 3));
    }, [timeRange]);

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans overflow-y-auto">

            {/* HEADER & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CEO Command Center</h1>
                    <p className="text-slate-400 mt-2 font-medium">Business Health & Strategic Overview</p>
                </div>
                <div className="bg-[#151e32] p-1 rounded-xl border border-slate-700 flex">
                    <button onClick={() => setTimeRange("All")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === "All" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>All Time</button>
                    <button onClick={() => setTimeRange("Month")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === "Month" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>This Month</button>
                </div>
            </div>

            {/* 1. FINANCIAL KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <KPICard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<DollarSign />} color="text-emerald-400" bg="bg-emerald-500/10" trend={timeRange === 'All' ? "+Yearly" : "+Monthly"} trendUp={true} />
                <KPICard title="Est. Net Profit (70%)" value={`₹${stats.profit.toLocaleString()}`} icon={<Activity />} color="text-blue-400" bg="bg-blue-500/10" trend="Healthy" trendUp={true} />

                {/* Target Progress */}
                <div className="bg-[#151e32] p-6 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold uppercase">Yearly Target</span>
                        <span className="text-purple-400 text-xs font-bold">{stats.percentage.toFixed(1)}%</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-4">₹50,00,000</h3>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${stats.percentage}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Goal: ₹50 Lakhs Revenue</p>
                </div>
            </div>

            {/* 2. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-indigo-400" /> Revenue Trajectory</h3>
                    <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueTrend}><defs><linearGradient id="colorRevCEO" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} /><XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} /><YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={4} fill="url(#colorRevCEO)" /></AreaChart></ResponsiveContainer></div>
                </div>

                {/* Top Performers */}
                <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Crown className="text-yellow-400" /> Top Performers</h3>
                    <div className="flex-1 space-y-4">{topEmployees.map((emp, index) => (<div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b1120] border border-slate-700/50"><div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-white'}`}>{index + 1}</div><div className="flex-1"><h4 className="font-bold text-lg">{emp.name}</h4><p className="text-xs text-slate-400">{emp.tasks} Tasks Done</p></div>{index === 0 && <Crown size={20} className="text-yellow-400" />}</div>))}</div>
                </div>
            </div>

            {/* 3. RECENT DEALS */}
            <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><DollarSign className="text-emerald-400" /> Recent High-Value Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{recentBigDeals.map((deal, i) => (<div key={i} className="bg-[#0b1120] p-6 rounded-2xl border border-slate-700/50"><div className="flex justify-between items-start mb-4"><div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400"><Users size={24} /></div><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${deal.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{deal.status}</span></div><h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Client</h4><p className="text-lg font-bold text-white mb-4 truncate">{typeof deal.client === 'object' ? deal.client.name : deal.client}</p><div className="border-t border-slate-800 pt-4 flex justify-between items-center"><span className="text-2xl font-bold text-white">₹{Number(deal.amount).toLocaleString()}</span><ArrowUpRight className="text-slate-500" /></div></div>))}</div>
            </div>
        </div>
    );
};

// --- 👷 EMPLOYEE DASHBOARD COMPONENT (With Notification Popups) ---
const EmployeeDashboard = ({ user }) => {
    const { addToast } = useToast();
    const [stats, setStats] = useState({ revenue: 0, leads: 0, tasks: 0, overdueInvoices: 0 });
    const [graphData, setGraphData] = useState([]);
    const [leadsData, setLeadsData] = useState([]);
    const [taskPriorityData, setTaskPriorityData] = useState([]);
    const [myNotifications, setMyNotifications] = useState([]);

    useEffect(() => {
        const invoices = JSON.parse(localStorage.getItem("crm_invoices_v3") || "[]");
        const leads = JSON.parse(localStorage.getItem("crm_leads") || "[]");
        const tasks = JSON.parse(localStorage.getItem("crm_tasks") || "[]");
        let notifications = JSON.parse(localStorage.getItem("crm_notifications") || "[]");

        // 🔔 POPUP LOGIC
        const newAlerts = notifications.filter(n => (n.targetUser?.toLowerCase() === user?.name?.split(" ")[0].toLowerCase() || n.targetUser === "All") && !n.isRead);
        if (newAlerts.length > 0) {
            newAlerts.forEach(alert => addToast(`🔔 ${alert.message}`, "info"));
            const updatedNotes = notifications.map(n => newAlerts.find(a => a.id === n.id) ? { ...n, isRead: true } : n);
            localStorage.setItem("crm_notifications", JSON.stringify(updatedNotes));
            notifications = updatedNotes;
        }

        // Stats Logic
        const myNotes = notifications.filter(n => n.targetUser?.toLowerCase() === user?.name?.split(" ")[0].toLowerCase() || n.targetUser === "All").slice(0, 3);
        setMyNotifications(myNotes);
        const totalRevenue = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + Number(inv.amount), 0);
        const activeLeads = leads.filter(l => l.status !== "Closed").length;
        const myTasks = tasks.filter(t => t.assignee?.toLowerCase().includes(user.name.split(" ")[0].toLowerCase()));
        const pendingTasks = myTasks.filter(t => t.status !== "Done").length;
        const overdueCount = invoices.filter(inv => inv.status === "Overdue").length;

        setStats({ revenue: totalRevenue, leads: activeLeads, tasks: pendingTasks, overdueInvoices: overdueCount });
        setGraphData([{ name: 'W1', value: totalRevenue * 0.2 }, { name: 'W2', value: totalRevenue * 0.5 }, { name: 'W3', value: totalRevenue * 0.8 }, { name: 'W4', value: totalRevenue }]);
        const statusCounts = { New: 0, Contacted: 0, Qualified: 0, Closed: 0 };
        leads.forEach(l => { if (statusCounts[l.status] !== undefined) statusCounts[l.status]++; });
        setLeadsData([{ name: 'New', count: statusCounts.New }, { name: 'Contacted', count: statusCounts.Contacted }, { name: 'Qualified', count: statusCounts.Qualified }, { name: 'Won', count: statusCounts.Closed }]);
        const high = myTasks.filter(t => t.priority === "High").length;
        const medium = myTasks.filter(t => t.priority === "Medium").length;
        const low = myTasks.filter(t => t.priority === "Low").length;
        setTaskPriorityData([{ name: 'High 🔥', value: high, color: '#ef4444' }, { name: 'Medium ⚡', value: medium, color: '#facc15' }, { name: 'Low ☕', value: low, color: '#10b981' }]);
    }, [user]);

    const cards = [
        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: "bg-indigo-600", text: "text-white" },
        { title: "Active Leads", value: stats.leads, icon: <Users size={24} />, color: "bg-emerald-500", text: "text-white" },
        { title: "My Pending Tasks", value: stats.tasks, icon: <Clock size={24} />, color: "bg-amber-500", text: "text-white" },
        { title: "Overdue Invoices", value: stats.overdueInvoices, icon: <AlertTriangle size={24} />, color: "bg-red-500", text: "text-white" },
    ];

    return (
        <div className="p-6 min-h-screen bg-[#0b1120] text-white font-sans overflow-y-auto">
            <div className="mb-8 flex justify-between items-end">
                <div><h1 className="text-3xl font-bold text-white">Welcome back, <span className="text-indigo-400">{user?.name}</span> 👋</h1><p className="text-slate-400 mt-1">Here's your work overview.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, index) => (<div key={index} className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-lg hover:-translate-y-1 transition-transform"><div className="flex justify-between items-start"><div><p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{card.title}</p><h3 className="text-3xl font-bold mt-2 text-white">{card.value}</h3></div><div className={`p-3 rounded-xl shadow-lg ${card.color} ${card.text}`}>{card.icon}</div></div></div>))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-2 mb-6"><TrendingUp className="text-emerald-400" size={20} /><h3 className="font-bold text-lg">Revenue Growth</h3></div>
                    <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={graphData}><defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} /><XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fill="url(#colorRev)" /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Bell className="text-indigo-400" size={20} /> Recent Alerts</h3><Link to="/notifications" className="text-xs text-indigo-400 font-bold hover:underline">View All</Link></div>
                    <div className="flex-1 space-y-4">{myNotifications.length > 0 ? (myNotifications.map(note => (<div key={note.id} className="bg-[#0b1120] p-3 rounded-xl border border-slate-700/50 flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div><div><p className="text-sm font-bold text-slate-200 leading-tight">{note.message}</p><p className="text-[10px] text-slate-500 mt-1">{note.date}</p></div></div>))) : (<div className="text-center text-slate-500 text-sm mt-10">No new alerts 🎉</div>)}</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-2 mb-6"><BarChart2 className="text-blue-400" size={20} /><h3 className="font-bold text-lg">Leads Pipeline</h3></div>
                    <div className="h-[250px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={leadsData}><CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} /><XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} /></BarChart></ResponsiveContainer></div>
                </div>
                <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-2 mb-6"><PieIcon className="text-yellow-400" size={20} /><h3 className="font-bold text-lg">My Workload</h3></div>
                    <div className="h-[250px] w-full relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={taskPriorityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{taskPriorityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}</Pie><Tooltip content={<CustomTooltip />} /><Legend verticalAlign="bottom" height={36} iconType="circle" /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8"><span className="text-slate-500 text-xs font-bold">TASKS</span></div></div>
                </div>
            </div>
        </div>
    );
};

// --- 🚀 MAIN DASHBOARD EXPORT ---
export default function Dashboard() {
    const { user } = useAuth();

    // 1. Agar role 'admin' ya 'manager' hai -> CEO VIEW
    if (user?.role === 'admin' || user?.role === 'manager') {
        return <CEODashboard />;
    }

    // 2. Agar Employee hai -> EMPLOYEE VIEW
    return <EmployeeDashboard user={user} />;
}
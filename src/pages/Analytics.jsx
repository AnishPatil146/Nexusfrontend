import React from "react";
import {
    AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend, RadialBarChart, RadialBar, YAxis
} from 'recharts';

export default function Analytics() {

    // --- 1. REVENUE DATA (Wave) ---
    const revenueData = [
        { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 5000 }, { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 }, { name: 'Sat', value: 2390 }, { name: 'Sun', value: 3490 },
    ];

    // --- 2. PROJECT STATUS (Donut) ---
    const projectData = [
        { name: 'Done', value: 65, color: '#10b981' },
        { name: 'Pending', value: 25, color: '#facc15' },
        { name: 'Issues', value: 10, color: '#ef4444' },
        { name: 'Review', value: 20, color: '#3b82f6' },
    ];

    // --- 3. GROWTH (Bar) ---
    const growthData = [
        { name: 'Jan', value: 20 }, { name: 'Feb', value: 45 },
        { name: 'Mar', value: 30 }, { name: 'Apr', value: 50 },
        { name: 'May', value: 70 },
    ];

    // --- 4. PERFORMANCE (Radar) ---
    const radarData = [
        { subject: 'Speed', A: 120, fullMark: 150 }, { subject: 'Quality', A: 98, fullMark: 150 },
        { subject: 'Uptime', A: 86, fullMark: 150 }, { subject: 'Security', A: 99, fullMark: 150 },
        { subject: 'Support', A: 85, fullMark: 150 }, { subject: 'Growth', A: 65, fullMark: 150 },
    ];

    // --- 5. RETENTION (Line) ---
    const retentionData = [
        { name: 'W1', value: 100 }, { name: 'W2', value: 85 },
        { name: 'W3', value: 70 }, { name: 'W4', value: 65 },
        { name: 'W5', value: 60 }, { name: 'W6', value: 58 },
    ];

    // --- 6. VELOCITY (Double Line) ---
    const velocityData = [
        { name: 'S1', teamA: 40, teamB: 24 }, { name: 'S2', teamA: 30, teamB: 13 },
        { name: 'S3', teamA: 20, teamB: 58 }, { name: 'S4', teamA: 27, teamB: 39 },
        { name: 'S5', teamA: 18, teamB: 48 },
    ];

    // --- 7. BUDGET (Horizontal Bar) ---
    const budgetData = [
        { name: 'Mkt', value: 4000 }, { name: 'Dev', value: 3000 },
        { name: 'Sales', value: 2000 }, { name: 'Ops', value: 2780 },
    ];

    // --- 8. SATISFACTION (Radial) ---
    const satisfactionData = [
        { name: '18-24', uv: 31.47, fill: '#8884d8' },
        { name: '25-29', uv: 26.69, fill: '#83a6ed' },
        { name: '30-34', uv: 15.69, fill: '#8dd1e1' },
        { name: '35-39', uv: 8.22, fill: '#82ca9d' },
    ];

    // --- 9. TRAFFIC SOURCE (Pie) ---
    const trafficData = [
        { name: 'Google', value: 400, color: '#3b82f6' },
        { name: 'Direct', value: 300, color: '#a855f7' },
        { name: 'Social', value: 300, color: '#ec4899' },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] p-8 text-white font-sans overflow-y-auto">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* HEADER */}
            <div className="relative z-10 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Analytics Overview
                    </h1>
                    <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mt-2 border-l-2 border-cyan-500 pl-3">
                        CEO View • 9 Charts Live
                    </p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-xs text-slate-500">Last Updated</p>
                    <p className="text-sm font-bold text-white">Just Now</p>
                </div>
            </div>

            {/* 📊 3x3 GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pb-10">

                {/* 1. TOTAL REVENUE */}
                <ChartCard title="Total Revenue" color="cyan">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#colorRev)" />
                    </AreaChart>
                </ChartCard>

                {/* 2. PROJECT STATUS */}
                <ChartCard title="Project Status" color="emerald">
                    <div className="relative h-full w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={projectData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {projectData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">92%</span>
                        </div>
                    </div>
                </ChartCard>

                {/* 3. COMPANY GROWTH */}
                <ChartCard title="Company Growth" color="purple">
                    <BarChart data={growthData}>
                        <CartesianGrid opacity={0.1} vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ChartCard>

                {/* 4. PERFORMANCE METRICS */}
                <ChartCard title="Performance" color="pink">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Radar name="A" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                    </RadarChart>
                </ChartCard>

                {/* 5. TEAM VELOCITY */}
                <ChartCard title="Team Velocity" color="blue">
                    <LineChart data={velocityData}>
                        <CartesianGrid opacity={0.1} vertical={false} />
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <Line type="monotone" dataKey="teamA" stroke="#3b82f6" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="teamB" stroke="#6366f1" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                </ChartCard>

                {/* 6. CLIENT RETENTION */}
                <ChartCard title="Retention Rate" color="green">
                    <LineChart data={retentionData}>
                        <CartesianGrid opacity={0.1} vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <Line type="step" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </LineChart>
                </ChartCard>

                {/* 7. BUDGET USAGE */}
                <ChartCard title="Budget Usage" color="yellow">
                    <BarChart layout="vertical" data={budgetData}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={40} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <Bar dataKey="value" fill="#eab308" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ChartCard>

                {/* 8. SATISFACTION */}
                <ChartCard title="Satisfaction" color="indigo">
                    <RadialBarChart innerRadius="20%" outerRadius="100%" data={satisfactionData} startAngle={180} endAngle={0}>
                        <RadialBar background dataKey="uv" cornerRadius={10} />
                        <Legend iconSize={5} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', color: '#ccc' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                    </RadialBarChart>
                </ChartCard>

                {/* 9. TRAFFIC SOURCES */}
                <ChartCard title="Traffic Sources" color="orange">
                    <div className="flex items-center gap-4 h-full">
                        <div className="flex-1 h-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={trafficData} innerRadius={40} outerRadius={60} dataKey="value">
                                        {trafficData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-2 text-xs text-slate-400">
                            {trafficData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }}></div>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>

            </div>
        </div>
    );
}

// --- HELPER COMPONENT (Taaki code clean rahe) ---
function ChartCard({ title, color, children }) {
    const colors = {
        cyan: 'bg-cyan-500', emerald: 'bg-emerald-500', purple: 'bg-purple-500',
        pink: 'bg-pink-500', blue: 'bg-blue-500', green: 'bg-green-500',
        yellow: 'bg-yellow-500', indigo: 'bg-indigo-500', orange: 'bg-orange-500'
    };

    return (
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-lg flex flex-col h-[280px]">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-1 h-5 ${colors[color]} rounded-full shadow-[0_0_10px_currentColor]`}></div>
                <h3 className="font-bold text-slate-200">{title}</h3>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
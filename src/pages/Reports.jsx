import React, { useState } from "react";
import {
    FileSpreadsheet, Calendar, TrendingUp, Users, Package, AlertTriangle, ArrowDownToLine
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx'; // 👈 IMPORT REAL EXCEL LIBRARY

export default function Reports() {
    const [activeTab, setActiveTab] = useState("sales");
    const [filter, setFilter] = useState("Last 30 Days");

    // --- MOCK DATA (Jo Excel mein jayega) ---
    const salesData = [
        { Week: 'Week 1', Revenue: 4000, Profit: 2400, Orders: 120 },
        { Week: 'Week 2', Revenue: 3000, Profit: 1398, Orders: 95 },
        { Week: 'Week 3', Revenue: 9800, Profit: 6800, Orders: 310 },
        { Week: 'Week 4', Revenue: 6500, Profit: 3908, Orders: 215 },
    ];

    const performanceData = [
        { Employee: 'Rahul', Tasks_Done: 45, Efficiency: 92, Status: 'Excellent' },
        { Employee: 'Sneha', Tasks_Done: 38, Efficiency: 88, Status: 'Good' },
        { Employee: 'Amit', Tasks_Done: 25, Efficiency: 75, Status: 'Average' },
        { Employee: 'Priya', Tasks_Done: 50, Efficiency: 98, Status: 'Star' },
    ];

    const stockData = [
        { Category: 'Laptops', Stock_Value: 400, Count: 45 },
        { Category: 'Keyboards', Stock_Value: 300, Count: 120 },
        { Category: 'Monitors', Stock_Value: 300, Count: 80 },
        { Category: 'Cables', Stock_Value: 200, Count: 500 },
    ];

    const lowStockItems = [
        { ID: 101, Item: "Dell Monitor 24\"", Remaining: 2, Status: "Critical" },
        { ID: 102, Item: "USB-C Hub", Remaining: 5, Status: "Low" },
        { ID: 103, Item: "Ergo Chair", Remaining: 1, Status: "Critical" },
    ];

    // --- 🔥 REAL EXCEL DOWNLOAD FUNCTION ---
    const handleExcelDownload = (reportType) => {
        try {
            let dataToExport = [];
            let fileName = "Report.xlsx";

            // 1. Select Data based on Button Click
            if (reportType === 'Revenue') {
                dataToExport = salesData;
                fileName = "Sales_Revenue_Report.xlsx";
            } else if (reportType === 'Performance') {
                dataToExport = performanceData;
                fileName = "Employee_Performance_Report.xlsx";
            } else if (reportType === 'Inventory_Chart') {
                dataToExport = stockData;
                fileName = "Inventory_Summary.xlsx";
            } else if (reportType === 'Low_Stock_Alerts') {
                dataToExport = lowStockItems;
                fileName = "Critical_Stock_Alerts.xlsx";
            }

            // 2. Create Excel Worksheet
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // 3. Trigger Download
            XLSX.writeFile(workbook, fileName);

            // 4. Success Toast
            toast.success(`${fileName} Downloaded Successfully! 🚀`, {
                style: { background: '#10b981', color: '#fff', fontWeight: 'bold' },
                duration: 3000
            });

        } catch (error) {
            toast.error("Download Failed!");
            console.error(error);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Analytics & Reports
                    </h1>
                    <p className="text-slate-400 mt-1">Advanced Data Export Center</p>
                </div>

                {/* DATE FILTER */}
                <div className="bg-[#151e32] flex items-center px-4 py-2 rounded-xl border border-slate-700 relative">
                    <Calendar size={16} className="text-slate-400 mr-2" />
                    {/* 🔥 UPDATED DARK DROPDOWN */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent outline-none text-sm font-bold text-white cursor-pointer appearance-none pr-4"
                        style={{ colorScheme: "dark" }}
                    >
                        <option className="bg-[#1e293b] text-white">Last 7 Days</option>
                        <option className="bg-[#1e293b] text-white">Last 30 Days</option>
                        <option className="bg-[#1e293b] text-white">Last Quarter</option>
                    </select>
                </div>
            </div>

            {/* --- TABS --- */}
            <div className="flex gap-4 mb-8 border-b border-slate-800 pb-1">
                <button onClick={() => setActiveTab("sales")} className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'sales' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <TrendingUp size={18} /> Sales
                </button>
                <button onClick={() => setActiveTab("performance")} className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'performance' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <Users size={18} /> Performance
                </button>
                <button onClick={() => setActiveTab("stock")} className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'stock' ? 'border-fuchsia-500 text-fuchsia-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    <Package size={18} /> Stock
                </button>
            </div>

            {/* --- 1. SALES TAB --- */}
            {activeTab === "sales" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800"><p className="text-slate-400 text-xs font-bold uppercase">Total Revenue</p><h3 className="text-3xl font-bold text-emerald-400 mt-1">$23,300</h3></div>
                        <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800"><p className="text-slate-400 text-xs font-bold uppercase">Net Profit</p><h3 className="text-3xl font-bold text-blue-400 mt-1">$14,580</h3></div>
                        <div className="bg-[#151e32] p-6 rounded-2xl border border-slate-800"><p className="text-slate-400 text-xs font-bold uppercase">Growth</p><h3 className="text-3xl font-bold text-green-400 mt-1">+12.5%</h3></div>
                    </div>

                    <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl mb-6">
                        <h3 className="text-xl font-bold text-white mb-6">Revenue Trend</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="Week" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Area type="monotone" dataKey="Revenue" stroke="#10b981" fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 🔥 REAL DOWNLOAD BUTTON */}
                        <div className="mt-6 flex justify-end pt-6 border-t border-slate-700">
                            <button onClick={() => handleExcelDownload('Revenue')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                                <FileSpreadsheet size={20} /> Download Revenue Excel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. PERFORMANCE TAB --- */}
            {activeTab === "performance" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl mb-6">
                        <h3 className="text-xl font-bold text-white mb-6">Employee Efficiency</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData} barSize={50}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="Employee" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                    <Bar dataKey="Tasks_Done" name="Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Efficiency" name="Efficiency %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 🔥 REAL DOWNLOAD BUTTON */}
                        <div className="mt-6 flex justify-end pt-6 border-t border-slate-700">
                            <button onClick={() => handleExcelDownload('Performance')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                                <FileSpreadsheet size={20} /> Download Team Report (.xlsx)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 3. STOCK TAB --- */}
            {activeTab === "stock" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6">Inventory Status</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stockData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="Stock_Value" nameKey="Category">
                                        {stockData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#3b82f6' : '#10b981'} stroke="none" />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 🔥 REAL DOWNLOAD BUTTON */}
                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <button onClick={() => handleExcelDownload('Inventory_Chart')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
                                <FileSpreadsheet size={20} /> Export Inventory Data
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><AlertTriangle className="text-red-400" /> Low Stock Alerts</h3>
                            <div className="space-y-4">
                                {lowStockItems.map((item) => (
                                    <div key={item.ID} className="flex items-center justify-between p-4 bg-[#0b1120] rounded-xl border border-slate-700">
                                        <div><h4 className="font-bold text-white">{item.Item}</h4><p className="text-xs text-slate-500">Item ID: #{item.ID}</p></div>
                                        <div className="text-right"><span className="block font-bold text-red-400">{item.Remaining} Left</span><span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded uppercase">{item.Status}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔥 REAL DOWNLOAD BUTTON */}
                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <button onClick={() => handleExcelDownload('Low_Stock_Alerts')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
                                <ArrowDownToLine size={20} /> Download Critical Stock List
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
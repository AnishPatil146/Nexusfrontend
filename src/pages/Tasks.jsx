import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
    CheckSquare, Plus, Clock, AlertCircle, MoreVertical, Calendar,
    Search, Filter, LayoutGrid, List, Trash2, User, X, CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Tasks() {
    const { user } = useAuth();
    const [view, setView] = useState("list");
    const [filterPriority, setFilterPriority] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- INITIAL DATA LOAD ---
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("nexus_tasks");
        return saved ? JSON.parse(saved) : [
            { id: 1, title: "Fix Login Bug", assignedTo: "Rahul Team", assignedBy: "Anish Patil", status: "In Progress", priority: "High", due: "2024-02-10" },
            { id: 2, title: "Design Dashboard", assignedTo: "Rahul Team", assignedBy: "Anish Patil", status: "Pending", priority: "Medium", due: "2024-02-12" },
        ];
    });

    const [newTask, setNewTask] = useState({ title: "", assignedTo: "", priority: "Medium", due: "" });

    // --- SAVE TO LOCALSTORAGE ---
    useEffect(() => {
        localStorage.setItem("nexus_tasks", JSON.stringify(tasks));
    }, [tasks]);

    // --- LOGIC: TASKS FILTER ---
    const myTasks = tasks.filter(task => {
        if (user?.role === 'admin') return true;
        if (user?.role === 'manager') return task.assignedTo === user.name || task.assignedBy === user.name;
        return task.assignedTo === user.name;
    });

    const filteredTasks = myTasks.filter(task => {
        const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPriority && matchesSearch;
    });

    // --- ACTIONS ---
    const handleAddTask = () => {
        if (!newTask.title || !newTask.assignedTo || !newTask.due) return toast.error("Please fill all details!");

        const task = {
            id: Date.now(),
            title: newTask.title,
            assignedTo: newTask.assignedTo,
            assignedBy: user.name,
            status: "Pending",
            priority: newTask.priority,
            due: newTask.due,
        };

        setTasks([task, ...tasks]);
        setIsModalOpen(false);
        setNewTask({ title: "", assignedTo: "", priority: "Medium", due: "" });
        toast.success(`Task assigned to ${newTask.assignedTo}!`);
    };

    const handleDelete = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
        toast.success("Task Deleted!");
    };

    // 🔥 NEW: STATUS CHANGE FUNCTION
    const handleStatusChange = (id, newStatus) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        if (newStatus === "Completed") toast.success("Task Completed! 🎉");
        else toast("Status Updated");
    };

    const canCreateTask = user?.role === 'admin' || user?.role === 'manager';

    // UI COLORS
    const getStatusColor = (s) => s === "Completed" ? "bg-emerald-500/20 text-emerald-400" : s === "In Progress" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400";
    const getPriorityColor = (p) => p === "High" ? "text-red-400" : p === "Medium" ? "text-yellow-400" : "text-slate-400";

    return (
        <div className="p-8 min-h-screen bg-[#0b1120] text-white font-sans relative">

            {/* HEADER */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Task Management
                    </h1>
                    <p className="text-slate-400 mt-1">Logged in as: <span className="text-white font-bold">{user?.name}</span></p>
                </div>

                {canCreateTask && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
                        <Plus size={18} /> Assign Task
                    </button>
                )}
            </div>

            {/* TOOLBAR */}
            <div className="bg-[#151e32] p-4 rounded-2xl border border-slate-800 mb-6 flex gap-4 justify-between items-center">
                <div className="flex gap-4 flex-1">
                    <div className="flex items-center gap-2 bg-[#0b1120] px-4 py-2 rounded-xl border border-slate-700 w-64">
                        <Search size={16} className="text-slate-400" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks..." className="bg-transparent outline-none text-sm text-white w-full" />
                    </div>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-[#0b1120] text-white text-sm px-4 py-2 rounded-xl border border-slate-700 outline-none">
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                    </select>
                </div>
            </div>

            {/* TASK LIST TABLE */}
            <div className="bg-[#151e32] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1e293b] text-slate-400 text-xs uppercase font-bold">
                        <tr><th className="p-5">Task</th><th className="p-5">Assigned To</th><th className="p-5">Due</th><th className="p-5">Status</th><th className="p-5 text-right">Update Status / Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-[#1e293b]/50 transition-all">
                                <td className="p-5 font-bold">{task.title}</td>
                                <td className="p-5 text-indigo-300">{task.assignedTo}</td>
                                <td className="p-5 text-sm">{task.due}</td>

                                {/* Status Badge */}
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>{task.status}</span>
                                </td>

                                {/* 🔥 ACTION COLUMN: Status Dropdown + Delete */}
                                <td className="p-5 text-right">
                                    <div className="flex justify-end items-center gap-3">

                                        {/* Status Changer Dropdown */}
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className={`bg-[#0b1120] border border-slate-600 text-xs text-white rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-indigo-500 focus:border-indigo-500 transition-all`}
                                        >
                                            <option value="Pending">⏳ Pending</option>
                                            <option value="In Progress">🚧 In Progress</option>
                                            <option value="Completed">✅ Completed</option>
                                        </select>

                                        {/* Delete Button (Only for Managers/Admins) */}
                                        {canCreateTask && (
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete Task"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTasks.length === 0 && <div className="p-10 text-center text-slate-500">No tasks found.</div>}
            </div>

            {/* ASSIGN TASK MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Assign New Task</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl text-white outline-none" />

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-bold uppercase ml-1">Assign To</label>
                                <select value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl text-white outline-none">
                                    <option value="">Select Employee</option>
                                    <option value="Rahul Team">Rahul Team</option>
                                    <option value="Ankita Patil">Ankita Patil</option>
                                    <option value="Priya Singh">Priya Singh</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} className="bg-[#0b1120] border border-slate-700 p-3 rounded-xl text-white outline-none text-sm" />
                                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="bg-[#0b1120] border border-slate-700 p-3 rounded-xl text-white outline-none text-sm">
                                    <option>High</option><option>Medium</option><option>Low</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold px-4">Cancel</button>
                            <button onClick={handleAddTask} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl">Send Task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
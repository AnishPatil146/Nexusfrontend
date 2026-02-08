import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNotifications } from "../auth/NotificationContext";
import { Bell, Search, Menu, Check, X, User } from "lucide-react";

export default function TopBar({ toggleSidebar }) {
    const { user } = useAuth();
    const { notifications = [], handleLeaveAction } = useNotifications() || {};

    // 🔥 State for Dropdown
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click Outside to Close Logic
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full h-16 bg-[#151e32] border-b border-slate-800 flex items-center justify-between px-4 md:px-6 z-20 shadow-md relative">

            {/* Mobile Menu */}
            <div className="flex items-center gap-4 md:hidden">
                <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">NexusCRM</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-[#0b1120] px-4 py-2 rounded-xl border border-slate-700 w-96">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Global Search..." className="bg-transparent outline-none text-white w-full text-sm" />
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* 🔔 NOTIFICATION BELL WITH DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <Bell size={22} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-[#151e32] animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* 🔥 DROPDOWN MENU */}
                    {isOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 border-b border-slate-700 bg-[#151e32]">
                                <h3 className="font-bold text-white text-sm">Notifications</h3>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        No new notifications 🎉
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 border-b border-slate-700/50 hover:bg-[#253045] transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {notif.avatar || <User size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-300">
                                                        <span className="font-bold text-white">{notif.name}</span> requested <span className="text-indigo-400">{notif.type}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1 italic">"{notif.reason}"</p>
                                                    <p className="text-[10px] text-slate-600 mt-1 font-mono">{notif.dates}</p>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleLeaveAction(notif.id, "Approved")}
                                                            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-bold py-1.5 rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <Check size={12} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleLeaveAction(notif.id, "Rejected")}
                                                            className="flex-1 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 text-xs font-bold py-1.5 rounded-lg border border-rose-500/20 transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <X size={12} /> Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                    <div className="text-right hidden sm:block leading-tight">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/30 border border-slate-600">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </div>
    );
}
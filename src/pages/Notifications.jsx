import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const allNotes = JSON.parse(localStorage.getItem("crm_notifications") || "[]");

        // 🔍 Filter: Sirf Mere liye jo notes hain wahi dikhao
        const myNotes = allNotes.filter(n =>
            n.targetUser?.toLowerCase() === user?.name?.split(" ")[0].toLowerCase() ||
            n.targetUser === "All"
        );
        setNotifications(myNotes);
    }, [user]);

    const handleClear = () => {
        // Sirf mere notes delete karo, dusron ke nahi
        const allNotes = JSON.parse(localStorage.getItem("crm_notifications") || "[]");
        const otherNotes = allNotes.filter(n => n.targetUser?.toLowerCase() !== user?.name?.split(" ")[0].toLowerCase());

        localStorage.setItem("crm_notifications", JSON.stringify(otherNotes));
        setNotifications([]);
    };

    return (
        <div className="min-h-screen bg-[#0b1120] p-6 text-white font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-slate-400 text-xs mt-1">Updates on your tasks</p>
                </div>
                {notifications.length > 0 && (
                    <button onClick={handleClear} className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                        <Trash2 size={14} /> Clear All
                    </button>
                )}
            </div>

            <div className="max-w-3xl">
                {notifications.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                        <Bell size={40} className="mx-auto mb-4 opacity-50" />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((note) => (
                            <div key={note.id} className="bg-[#1e293b] p-5 rounded-2xl border-l-4 border-indigo-500 flex items-start gap-4 shadow-lg animate-fadeIn">
                                <div className="bg-indigo-500/20 p-2 rounded-full text-indigo-400 mt-1">
                                    <Info size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-200">{note.message}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{note.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
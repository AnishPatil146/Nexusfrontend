import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Database, Plus, X, LogIn, ShieldAlert, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://performancecrm-backend-2.onrender.com/api";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [savedUsers, setSavedUsers] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [newName, setNewName] = useState("");

    // --- LOAD SAVED USERS ---
    useEffect(() => {
        const localData = localStorage.getItem("crm_smart_users");
        if (localData) {
            setSavedUsers(JSON.parse(localData));
        } else {
            setSavedUsers([
                { name: "Anish Patil", email: "anish.ceo@nexus.com", role: "admin", color: "bg-indigo-600" }
            ]);
        }
    }, []);

    // --- 1. LOGIN & FORCE ENTRY LOGIC ---
    const handleLogin = async (account) => {
        const toastId = toast.loading(`Connecting ${account.name}...`);

        try {
            // Try Real Login
            const res = await login(account.email, "123456");

            if (res?.success) {
                toast.dismiss(toastId);
                toast.success("Login Success!");
                window.location.href = "/"; // Force Reload
            } else {
                throw new Error("Server Reject");
            }

        } catch (error) {
            // --- AGAR SERVER FAIL HO -> TOH ZABARDASTI GHUSO ---
            console.log("Server Failed, Activating Bypass...");
            toast.dismiss(toastId);

            // 1. Fake Token Set karo
            localStorage.setItem("token", "bypass-token-123");
            localStorage.setItem("user", JSON.stringify(account));

            // 2. User ko batao
            toast.success("Force Entry Activated! 🚀", { icon: "🔓" });

            // 3. Zabardasti Dashboard par pheko
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    };

    // --- 2. CREATE USER & FORCE ENTRY ---
    const handleCreateNewUser = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Creating Profile...");

        // Random Email (Conflict se bachne ke liye)
        const randomId = Math.floor(Math.random() * 99999);
        const uniqueEmail = `${newName.toLowerCase().replace(/\s/g, '')}.${randomId}@nexus.com`;

        const newUser = {
            name: newName,
            email: uniqueEmail,
            role: "employee",
            color: "bg-emerald-600"
        };

        try {
            // Try Register
            await axios.post(`${API_BASE}/auth/register`, {
                name: newName,
                email: uniqueEmail,
                password: "123456",
                role: "employee",
                companyName: "Nexus CRM",
                designation: "Staff"
            });

            // Try Login
            await login(uniqueEmail, "123456");

            // Agar yahan tak aa gaye toh sab sahi hai
            saveUserLocal(newUser);
            toast.dismiss(toastId);
            window.location.href = "/";

        } catch (error) {
            // --- AGAR ERROR AAYE -> BYPASS MODE ---
            toast.dismiss(toastId);
            toast.error("Server Error. Bypassing...", { icon: "⚠️" });

            // Save Local & Force Enter
            saveUserLocal(newUser);
            localStorage.setItem("token", "bypass-token-123");
            localStorage.setItem("user", JSON.stringify(newUser));

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    };

    const saveUserLocal = (user) => {
        const updated = [user, ...savedUsers].slice(0, 5);
        setSavedUsers(updated);
        localStorage.setItem("crm_smart_users", JSON.stringify(updated));
    };

    const removeUser = (e, email) => {
        e.stopPropagation();
        const updated = savedUsers.filter(u => u.email !== email);
        setSavedUsers(updated);
        localStorage.setItem("crm_smart_users", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

                <div className="text-center mb-6">
                    <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4 ring-1 ring-red-500/50">
                        <ShieldAlert className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">System Access</h2>
                    <p className="text-slate-400 text-xs mt-1">Force Entry Enabled</p>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {savedUsers.map((acc, index) => (
                        <div key={index} onClick={() => handleLogin(acc)} className="group relative w-full flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500 rounded-2xl transition-all cursor-pointer">
                            <div className={`w-10 h-10 ${acc.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>{acc.name.charAt(0)}</div>
                            <div className="flex-1 text-left">
                                <h3 className="text-white font-semibold text-sm group-hover:text-red-300">{acc.name}</h3>
                                <p className="text-slate-500 text-[10px]">{acc.email}</p>
                            </div>
                            <button onClick={(e) => removeUser(e, acc.email)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-full text-slate-500 hover:text-red-500 transition-all z-20"><X size={14} /></button>
                            <div className="absolute right-4"><Zap size={16} className="text-slate-600 group-hover:text-yellow-400" /></div>
                        </div>
                    ))}
                </div>

                {!showInput ? (
                    <button onClick={() => setShowInput(true)} className="w-full mt-5 py-3 border border-dashed border-slate-600 text-slate-400 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 hover:text-white transition-all text-sm">
                        <Plus size={16} /> Create & Enter
                    </button>
                ) : (
                    <form onSubmit={handleCreateNewUser} className="mt-5 p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <input type="text" placeholder="Name" required autoFocus className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-red-500 outline-none" value={newName} onChange={e => setNewName(e.target.value)} />
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={() => setShowInput(false)} className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-xs">Cancel</button>
                            <button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">Force Enter 🚀</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
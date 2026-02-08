import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { User, Bell, Lock, Moon, Globe, Shield } from "lucide-react";

export default function Settings() {
    const { user } = useAuth();

    // Fake state for toggles (Visual only for now)
    const [emailNotif, setEmailNotif] = useState(true);
    const [sound, setSound] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-950 text-white font-sans">

            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-20"></div>

                        <div className="relative mt-4 mb-4">
                            <img
                                src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-slate-900 mx-auto shadow-xl"
                            />
                            <div className="absolute bottom-0 right-1/2 translate-x-10 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900"></div>
                        </div>

                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-slate-400 text-sm mb-4">{user.email}</p>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border 
               ${user.role === 'CEO' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-purple-500/10 border-purple-500 text-purple-400'}`}>
                            {user.role}
                        </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Session Info</h3>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-white">Last Login</span>
                            <span className="text-sm text-slate-500">Just now</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white">Location</span>
                            <span className="text-sm text-slate-500">Mumbai, IN</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Settings Forms */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Appearance & Notifications */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                            <Bell size={20} className="text-cyan-400" /> Preferences
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Email Notifications</p>
                                    <p className="text-slate-500 text-sm">Receive daily summaries and alerts</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotif(!emailNotif)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${emailNotif ? 'bg-cyan-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Sound Effects</p>
                                    <p className="text-slate-500 text-sm">Play sounds for completed tasks</p>
                                </div>
                                <button
                                    onClick={() => setSound(!sound)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${sound ? 'bg-cyan-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${sound ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Security */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                            <Shield size={20} className="text-emerald-400" /> Security
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Two-Factor Authentication</p>
                                    <p className="text-slate-500 text-sm">Add an extra layer of security</p>
                                </div>
                                <button
                                    onClick={() => setTwoFactor(!twoFactor)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <button className="text-sm text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
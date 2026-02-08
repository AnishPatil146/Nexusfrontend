import React from "react";
import { useAuth } from "../auth/AuthContext"; // Context se functions laye
import { User } from "lucide-react";

export default function Login() {
    const { login, loginWithGoogle } = useAuth(); // Context functions

    // Hardcoded Accounts for Quick Access
    const savedAccounts = [
        { name: "Anish Patil", email: "anish@crm.com", role: "admin", avatar: "A", color: "bg-purple-600" },
        { name: "Rahul Team", email: "rahul@crm.com", role: "employee", avatar: "R", color: "bg-emerald-600" },
        { name: "Ankita Patil", email: "ankitapatilap200@gmail.com", role: "manager", avatar: "AP", color: "bg-orange-600" }
    ];

    // Handle Mock Login (Click on name)
    const handleQuickLogin = (account) => {
        // Ye seedha context call karega, page reload nahi karega
        login(account);
    };

    return (
        <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Background Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Glassmorphism Card */}
            <div className="bg-[#151e32]/80 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-10 rounded-[28px] shadow-2xl w-full max-w-[448px] flex flex-col items-center relative z-10 animate-in fade-in zoom-in-95 duration-300">

                {/* Google-Style Logo Area */}
                <div className="mb-6 bg-white p-3 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="32" height="32">
                        <g>
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </g>
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Sign in</h2>
                <p className="text-base text-slate-400 mb-8 text-center">
                    to continue to <span className="font-bold text-indigo-400">NexusCRM</span>
                </p>

                {/* Account List */}
                <div className="w-full space-y-2 mb-8">
                    {savedAccounts.map((acc, index) => (
                        <div
                            key={index}
                            onClick={() => handleQuickLogin(acc)}
                            className="flex items-center gap-4 p-3 hover:bg-[#1e293b] border border-transparent hover:border-slate-700/50 rounded-2xl cursor-pointer transition-all group"
                        >
                            <div className={`w-10 h-10 ${acc.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-[#151e32] group-hover:scale-110 transition-transform`}>
                                {acc.avatar}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{acc.name}</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{acc.email}</p>
                            </div>
                        </div>
                    ))}

                    {/* Use Another Account (Triggers Google Login) */}
                    <div
                        onClick={loginWithGoogle}
                        className="flex items-center gap-4 p-3 hover:bg-[#1e293b] border border-transparent hover:border-slate-700/50 rounded-2xl cursor-pointer transition-all mt-4 group"
                    >
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white border border-slate-700 group-hover:border-slate-500 transition-all">
                            <User size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white">Use another account</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center w-full mt-4 border-t border-slate-800/50 pt-6">
                    <p className="text-xs text-slate-600">
                        Authorized personnel only. <br /> Protected by Nexus Security Systems.
                    </p>
                </div>

            </div>
        </div>
    );
}
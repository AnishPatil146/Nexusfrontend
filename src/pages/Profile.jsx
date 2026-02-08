import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Save, Camera, Lock, ArrowLeft, Upload } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // 👈 File input reference

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        // Agar DB mein avatar hai toh wo, nahi toh Google wala, nahi toh blank
        avatar: user?.avatar || ""
    });

    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(user?.avatar || ""); // 👈 Instant Preview ke liye

    // 1. Image Upload Handler (Desktop se file lo aur Base64 banao)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                alert("File size is too big! Please upload under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Screen par dikhao
                setFormData({ ...formData, avatar: reader.result }); // State mein set karo
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Update Profile Handler
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5001/api/users/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage("Profile updated successfully! (Refresh to see changes)");
            } else {
                setMessage("Failed to update.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server Error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-8 text-white font-sans flex items-center justify-center relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col md:flex-row gap-8">

                {/* LEFT COLUMN: Identity Card */}
                <div className="w-full md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-6">
                    <button onClick={() => navigate('/dashboard')} className="self-start mb-4 p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-slate-400">
                        <ArrowLeft size={20} />
                    </button>

                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 overflow-hidden relative">
                            {/* Profile Image Preview */}
                            <img
                                src={preview || "https://ui-avatars.com/api/?name=" + user?.name}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-[#0f172a]"
                            />

                            {/* Hover Effect */}
                            <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="text-white" size={24} />
                            </div>
                        </div>

                        {/* Camera Button Trigger */}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-slate-800 p-2 rounded-full border border-slate-600 hover:bg-cyan-600 transition-colors z-10"
                            title="Upload Photo"
                        >
                            <Camera size={16} />
                        </button>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <h2 className="text-2xl font-bold mt-4 text-center">{formData.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 ${user?.role === 'CEO' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                        {user?.role}
                    </span>

                    <div className="w-full mt-8 space-y-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700/50">
                            <p className="text-slate-400 text-xs uppercase">Google Linked</p>
                            <p className="text-sm font-bold text-green-400 truncate px-2">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Edit Form */}
                <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-cyan-400" /> Edit Profile Details
                    </h3>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 transition-colors">
                                <User size={18} className="text-slate-500 mr-3" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-transparent outline-none w-full text-white placeholder-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Email Address (Read Only)</label>
                            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 opacity-60 cursor-not-allowed">
                                <Mail size={18} className="text-slate-500 mr-3" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-transparent outline-none w-full text-white placeholder-slate-600 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Change Password</label>
                            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 transition-colors">
                                <Lock size={18} className="text-slate-500 mr-3" />
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-transparent outline-none w-full text-white placeholder-slate-600"
                                />
                            </div>
                        </div>

                        {message && (
                            <p className={`text-sm text-center font-bold ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}

                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <Save size={20} /> Save Changes
                        </button>
                    </form>
                </div>

            </motion.div>
        </div>
    );
}
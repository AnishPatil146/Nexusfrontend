import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, AlertTriangle, Zap, TrendingUp, ShieldAlert } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function AiAssistant() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hello ${user?.name?.split(" ")[0]}. I am online.`,
            sender: "ai",
            type: "intro"
        }
    ]);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

    const addMessage = (msg) => setMessages((prev) => [...prev, { ...msg, id: Date.now() }]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Add User Message
        addMessage({ text: input, sender: "user" });
        const userQuery = input;
        const lowerQuery = input.toLowerCase();
        setInput("");
        setIsTyping(true);

        // --- CEO-ONLY EMAIL COMMAND ---
        if (lowerQuery.startsWith("send email to")) {

            // A. PERMISSION CHECK
            if (user.role !== "CEO") {
                setTimeout(() => {
                    setIsTyping(false);
                    addMessage({
                        text: "⛔ ACCESS DENIED. Only the CEO can dispatch emails via Jarvis.",
                        sender: "ai",
                        type: "alert"
                    });
                }, 800);
                return;
            }

            // B. PARSE COMMAND
            const words = userQuery.split(" ");
            const toIndex = words.findIndex(w => w.toLowerCase() === "to");
            const sayingIndex = words.findIndex(w => w.toLowerCase() === "saying");

            if (toIndex !== -1 && sayingIndex !== -1 && words[toIndex + 1]) {
                const email = words[toIndex + 1];
                const messageBody = words.slice(sayingIndex + 1).join(" ");

                // C. EXECUTE (NO OTP)
                addMessage({ text: `📨 Dispatching executive email to ${email}...`, sender: "ai" });

                try {
                    const res = await fetch("http://localhost:5001/api/email/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ to: email, message: messageBody })
                    });
                    const data = await res.json();

                    setIsTyping(false);
                    if (data.success) {
                        addMessage({ text: `✅ Message sent successfully.`, sender: "ai", type: "success" });
                    } else {
                        addMessage({ text: `❌ Failed: ${data.error}`, sender: "ai", type: "alert" });
                    }
                } catch (err) {
                    setIsTyping(false);
                    addMessage({ text: "❌ Connection Error.", sender: "ai", type: "alert" });
                }
                return;
            }
        }

        // --- STANDARD RESPONSES ---
        setTimeout(() => {
            let response = "I am ready. Ask for data or 'Send email to [x] saying [y]'.";
            if (lowerQuery.includes("hello")) response = "Systems operational.";
            addMessage({ text: response, sender: "ai" });
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in origin-bottom-right flex flex-col max-h-[500px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="text-white" size={18} />
                            <span className="font-bold text-white text-sm">Jarvis v2.0</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-950/50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <Sparkles size={14} className="text-cyan-400 mr-2 mt-2 shrink-0" />}
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${msg.sender === 'user' ? 'bg-slate-700 text-white rounded-tr-none' :
                                        msg.type === 'alert' ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-none' :
                                            msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-tl-none' :
                                                'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                                    }`}
                                >
                                    {msg.type === 'alert' && <div className="flex items-center gap-2 font-bold text-red-400 mb-1"><ShieldAlert size={14} /> Denied</div>}
                                    {msg.type === 'success' && <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1"><TrendingUp size={14} /> Sent</div>}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-slate-500 text-xs ml-8">Processing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-950 text-white text-sm rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Command Jarvis..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="bg-cyan-500 hover:bg-cyan-400 text-white p-3 rounded-xl"><Send size={18} /></button>
                    </div>
                </div>
            )}

            {/* Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/50 hover:scale-110 transition-all shadow-2xl">
                {isOpen ? <X size={24} /> : <Zap size={24} fill="currentColor" />}
            </button>
        </div>
    );
}
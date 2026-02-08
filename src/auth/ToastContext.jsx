import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Toast Add Function
    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // 3 sec remove timer
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    // Toast Remove Function
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Styles
    const getStyles = (type) => {
        switch (type) {
            case "success": return "bg-emerald-500 text-white shadow-emerald-500/20";
            case "error": return "bg-red-500 text-white shadow-red-500/20";
            case "info": return "bg-blue-500 text-white shadow-blue-500/20";
            default: return "bg-slate-800 text-white";
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "success": return <CheckCircle size={20} />;
            case "error": return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* 🔔 NOTIFICATION CONTAINER (Top Right) */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-[300px] animate-slideIn ${getStyles(toast.type)}`}
                    >
                        {getIcon(toast.type)}
                        <p className="font-bold text-sm flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="hover:opacity-75"><X size={16} /></button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
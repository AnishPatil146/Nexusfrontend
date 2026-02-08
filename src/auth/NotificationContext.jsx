import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);
export const useNotifications = useNotification; // Alias for safety

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        refreshNotifications();
        window.addEventListener("storage", refreshNotifications);
        return () => window.removeEventListener("storage", refreshNotifications);
    }, [user]);

    const refreshNotifications = () => {
        if (!user) return;
        const leaves = JSON.parse(localStorage.getItem("nexus_leaves")) || [];

        // Manager ko sirf Pending dikhana hai
        if (user.role === "manager" || user.role === "admin") {
            const pending = leaves.filter(l => l.status === "Pending");
            setNotifications(pending);
        } else {
            setNotifications([]);
        }
    };

    // 🔥 NEW FUNCTION: Button click handle karne ke liye
    const handleLeaveAction = (id, status) => {
        const leaves = JSON.parse(localStorage.getItem("nexus_leaves")) || [];
        const updatedLeaves = leaves.map(l => l.id === id ? { ...l, status: status } : l);

        localStorage.setItem("nexus_leaves", JSON.stringify(updatedLeaves));

        if (status === "Approved") toast.success("Leave Approved! ✅");
        else toast.error("Leave Rejected! ❌");

        refreshNotifications(); // List update karo turant
        window.dispatchEvent(new Event("storage")); // Baaki jagah bhi update karo
    };

    return (
        // 'handleLeaveAction' ko pass kiya taaki TopBar use kar sake
        <NotificationContext.Provider value={{ notifications, refreshNotifications, handleLeaveAction }}>
            {children}
        </NotificationContext.Provider>
    );
};
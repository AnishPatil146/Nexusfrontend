import React from "react";
import { useAuth } from "../auth/AuthContext";

// 🔥 IMPORTS CORRECTED (Directly from pages folder)
import CEODashboard from "../pages/CeoDashboard";         // CEO wala page
import ManagerDashboard from "../pages/ManagerDashboard"; // Manager wala page
import EmployeeDashboard from "../pages/EmployeeDashboard"; // Employee wala page

const RoleRoute = () => {
    const { user } = useAuth();

    // 1. Loading State
    if (!user) {
        return (
            <div className="h-screen bg-[#0b1120] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    // 2. ROLE BASED SWITCHING
    // Admin role ke liye CEO Dashboard dikhayenge
    if (user.role === "admin") {
        return <CEODashboard user={user} />;
    }

    // Manager role ke liye Manager Dashboard
    if (user.role === "manager") {
        return <ManagerDashboard user={user} />;
    }

    // Baaki sabke liye (Employee) Employee Dashboard
    return <EmployeeDashboard user={user} />;
};

export default RoleRoute;
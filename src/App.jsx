import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- CONTEXTS (State) ---
import { AuthProvider, useAuth } from "./auth/AuthContext"; // 👈 Fixed Import
import { NotificationProvider } from "./auth/NotificationContext";
import { ToastProvider } from "./auth/ToastContext";

// --- COMPONENTS ---
import Login from "./pages/Login";
import Layout from "./components/Layout";
import RoleRoute from "./components/RoleRoute";

// --- PAGES ---
import Team from "./pages/Team";
import Performance from "./pages/Performance";
import Tasks from "./pages/Tasks";
import Leads from "./pages/Leads";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Leaves from "./pages/Leaves";

// --- PRIVATE ROUTE COMPONENT ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // 👈 Ab ye sahi chalega

  if (loading) {
    return (
      <div className="h-screen bg-[#0b1120] text-white flex items-center justify-center">
        Loading NexusCRM...
      </div>
    );
  }

  // Agar user nahi hai to Login pe bhejo, warna page dikhao
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>

          {/* Global Toast Notification */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
              duration: 4000,
            }}
          />

          <Routes>
            {/* 1. Login Page */}
            <Route path="/login" element={<Login />} />

            {/* 2. Protected Routes (Andar walo ke liye) */}
            <Route element={<Layout />}>

              {/* Dashboard (Auto-Switch CEO/Manager/Employee) */}
              <Route path="/" element={<PrivateRoute><RoleRoute /></PrivateRoute>} />

              {/* Other Pages */}
              <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
              <Route path="/performance" element={<PrivateRoute><Performance /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />

            </Route>

            {/* 3. Catch All (Agar kuch galat type kiya) */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
    const { user } = useAuth();

    // Agar user login nahi hai, toh Login page par bhejo
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Agar login hai, toh page dikhao
    return children;
}
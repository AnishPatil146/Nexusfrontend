import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // --- LOGIN FUNCTION (FIXED) ---
    const login = async (emailOrData, password) => {
        let email, pass;

        // Fix: Handle both (email, password) AND ({ email, password })
        if (typeof emailOrData === "object" && emailOrData.email) {
            email = emailOrData.email;
            pass = emailOrData.password;
        } else {
            email = emailOrData;
            pass = password;
        }

        try {
            // API Call
            const API_URL = import.meta.env.VITE_API_BASE_URL + "/auth/login";

            const res = await axios.post(API_URL, { email, password: pass });

            if (res.data.success) {
                const userData = res.data.user;
                const token = res.data.token;

                // Save to LocalStorage
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", token);

                // Update State
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/"; // Redirect to login
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
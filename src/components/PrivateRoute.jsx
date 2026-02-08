import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute() {
    const token = localStorage.getItem("token")

    // agar token nahi hai → login page
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // agar token hai → andar ke routes allow
    return <Outlet />
}

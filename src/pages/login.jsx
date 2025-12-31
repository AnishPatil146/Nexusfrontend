import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await API.post("/auth/login", {
                email,
                password
            })

            // 🔐 SAVE TOKEN
            localStorage.setItem("token", res.data.token)

            // 👤 SAVE USER INFO (IMPORTANT)
            localStorage.setItem("userName", res.data.user.name)
            localStorage.setItem("role", res.data.user.role)

            // 🔀 ROLE BASED REDIRECT
            if (res.data.user.role === "CEO") {
                navigate("/ceo-dashboard")
            } else if (res.data.user.role === "Manager") {
                navigate("/manager-dashboard")
            } else {
                navigate("/employee-dashboard")
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow w-80"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

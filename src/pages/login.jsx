import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // save user info
            localStorage.setItem("userName", user.displayName);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userPhoto", user.photoURL);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Google Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                {/* Email login (optional – later backend) */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                />

                <button className="w-full bg-blue-600 text-white py-2 rounded mb-3">
                    Login
                </button>

                {/* 🔥 GOOGLE LOGIN BUTTON */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full border flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

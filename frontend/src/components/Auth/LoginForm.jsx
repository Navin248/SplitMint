import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await api.login({ email, password });

            if (!data?.token) {
                setError("Invalid login response");
                return;
            }

            // ✅ persist auth
            login(data.user, data.token);

            // ✅ redirect after token is stored
            navigate("/groups");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                    ⚠️ {error}
                </div>
            )}

            <div>
                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email Address
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
                Sign In
            </button>

            <p className="text-sm text-center text-gray-400 mt-4">
                New to SplitMint?{" "}
                <Link to="/register" className="text-indigo-600 font-semibold">
                    Create Account
                </Link>
            </p>
        </form>
    );
}

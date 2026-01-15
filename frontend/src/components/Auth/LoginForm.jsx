import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.login({ email, password });
            if (data.token) {
                login(data.user, data.token);
                navigate('/groups');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div>
                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-100 focus:bg-white transition-all text-gray-800 font-medium"
                    placeholder="you@example.com"
                />
            </div>

            <div className="mb-2">
                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-100 focus:bg-white transition-all text-gray-800 font-medium"
                    placeholder="••••••••"
                />
            </div>

            <button type="submit" className="w-full btn btn-primary py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Sign In
            </button>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                    New to SplitMint? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </form>
    );
}

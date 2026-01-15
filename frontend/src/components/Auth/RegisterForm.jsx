import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.register({ email, password });
            if (data.id) { // Register returns user object (id, email) usually, or we assume auto-login? 
                // Backend `register` returns { message: "User created successfully", userId: ... } or similar?
                // Let's check authController.js.
                // It returns 201 created.
                // To auto-login we need to call login endpoint or if register returns token.
                // Backend register returns: res.status(201).json({ message: "User created successfully", userId: user.id });
                // So we must login after register.

                const loginData = await api.login({ email, password });
                if (loginData.token) {
                    login(loginData.user, loginData.token);
                    navigate('/groups');
                } else {
                    navigate('/login');
                }
            } else {
                setError(data.message || 'Registration failed');
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
                    placeholder="Create a password"
                />
            </div>

            <button type="submit" className="w-full btn btn-primary py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Get Started
            </button>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </form>
    );
}

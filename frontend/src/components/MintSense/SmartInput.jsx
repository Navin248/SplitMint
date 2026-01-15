import { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SmartInput({ groupId, onParse }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const handleParse = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${api.BASE_URL}/ai/parse-expense`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, groupId })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);
            if (data.suggestedExpense) {
                onParse(data.suggestedExpense);
                setText(''); // Clear input on success
            }
        } catch (err) {
            console.error("AI Parse Error:", err);
            setError("Couldn't understand that. Please try again or enter manually.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-xs font-bold text-indigo-500 uppercase mb-2 flex items-center gap-1">
                ✨ MintSense AI
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="e.g. Paid 1200 for Dinner with Alice and Bob"
                    className="flex-1 p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleParse())}
                />
                <button
                    type="button"
                    onClick={handleParse}
                    disabled={loading || !text.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {loading ? 'Thinking...' : 'Parse'}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <p className="text-indigo-400 text-xs mt-2 italic">
                Try: "Lunch 500 paid by me" or "Taxi 200 split with Bob"
            </p>
        </div>
    );
}

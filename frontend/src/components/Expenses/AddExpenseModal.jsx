import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SplitSelector from './SplitSelector';
import SmartInput from '../MintSense/SmartInput';

export default function AddExpenseModal({ isOpen, onClose, onExpenseAdded, groupId, participants, myParticipantId }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [payerId, setPayerId] = useState(myParticipantId || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Split State
    const [splitMode, setSplitMode] = useState('EQUAL'); // EQUAL, CUSTOM, PERCENTAGE
    const [splits, setSplits] = useState([]);

    const { token } = useAuth();

    // AI Callback
    const handleAIParse = (data) => {
        if (data.description) setDescription(data.description);
        if (data.amount) setAmount(data.amount);
        if (data.date) setDate(data.date);
        if (data.splitMode) {
            // Map AI split mode to our enums
            const modeMap = { 'EQUAL': 'EQUAL', 'PERCENTAGE': 'PERCENTAGE', 'CUSTOM': 'CUSTOM', 'Percent': 'PERCENTAGE', 'Exact': 'CUSTOM' };
            setSplitMode(modeMap[data.splitMode] || 'EQUAL');
        }

        // Auto-select payer if "You" or matches name
        if (data.payerName) {
            if (data.payerName.toLowerCase() === 'you') {
                setPayerId(myParticipantId);
            } else {
                const matchedPayer = participants.find(p => p.name.toLowerCase() === data.payerName.toLowerCase());
                if (matchedPayer) setPayerId(matchedPayer.participantId);
            }
        }

        // Handle involved names -> Splits
        // We don't have direct split setting here easily without complex logic to map names to IDs and prepopulate `splits` state or `SplitSelector`.
        // For now, let's just set the mode and let user refine splits if it's not EQUAL.
        // If EQUAL, backend just needs participant IDs. But `SplitSelector` handles UI.
        // Advanced: Try to match names in `involvedNames` to select them?
        // MVP: Just fill basic details.
    };

    // Update payerId when myParticipantId is available (if initially empty)
    useEffect(() => {
        if (!payerId && myParticipantId) {
            setPayerId(myParticipantId);
        }
    }, [myParticipantId, payerId]);

    if (!isOpen) return null;

    // Validation Logic
    const validate = () => {
        if (!description.trim()) return "Description is required.";
        if (!amount || Number(amount) <= 0) return "Amount must be greater than zero.";
        if (!payerId) return "Payer must be selected.";
        if (!splitMode) return "Split mode is invalid.";

        // Split Validation
        if (splitMode === 'CUSTOM') {
            const totalCustom = splits.reduce((sum, s) => sum + (s.amount || 0), 0);
            if (Math.abs(totalCustom - Number(amount)) > 0.05) {
                return `Custom splits sum (₹${totalCustom.toFixed(2)}) must match total amount (₹${Number(amount).toFixed(2)}).`;
            }
        }
        if (splitMode === 'PERCENTAGE') {
            const totalPct = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
            if (Math.abs(totalPct - 100) > 0.1) {
                return `Percentages must sum to 100% (Current: ${totalPct}%).`;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                amount: Number(amount),
                description,
                date,
                payerParticipantId: payerId,
                splitMode,
                splits: prepareSplitsPayload()
            };

            await api.addExpense(token, groupId, payload);
            onExpenseAdded();

            // Cleanup & Close
            setDescription('');
            setAmount('');
            setSplits([]);
            onClose();
        } catch (err) {
            setError('Failed to add expense: ' + (err.message || 'Unknown error'));
            // Keep modal open on error so user can fix
        } finally {
            setLoading(false);
        }
    };

    const prepareSplitsPayload = () => {
        if (splitMode === 'EQUAL') {
            return participants.map(p => ({ participantId: p.participantId }));
        }
        return splits;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                    Add Expense
                    {/* Close X */}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </h2>

                <SmartInput groupId={groupId} onParse={handleAIParse} />

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-100 flex items-start gap-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Dinner at Taj"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Paid By</label>
                        <select
                            value={payerId}
                            onChange={e => setPayerId(e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                        >
                            <option value="" disabled>Select Payer</option>
                            {participants.map(p => (
                                <option key={p.participantId} value={p.participantId}>
                                    {p.participantId === myParticipantId ? 'You' : p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Split Mode</label>
                        <div className="flex bg-gray-100 p-1 rounded">
                            {['EQUAL', 'CUSTOM', 'PERCENTAGE'].map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSplitMode(mode)}
                                    className={`flex-1 py-1 text-xs font-bold rounded transition-all ${splitMode === mode ? 'bg-white shadow text-blue-600 scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <SplitSelector
                        mode={splitMode}
                        participants={participants}
                        amount={amount}
                        setSplits={setSplits}
                    />

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 rounded text-white font-bold transition-all shadow ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
                        >
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

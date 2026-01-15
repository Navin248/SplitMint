import { useState, useEffect } from 'react';

export default function SplitSelector({ mode, participants, amount, setSplits }) {
    // We maintain local state for amounts/percentages and sync with parent `setSplits`.
    const [values, setValues] = useState({}); // { participantId: value }

    useEffect(() => {
        // transform values to parent format
        const result = participants.map(p => ({
            participantId: p.participantId,
            amount: mode === 'CUSTOM' ? Number(values[p.participantId] || 0) : undefined,
            percentage: mode === 'PERCENTAGE' ? Number(values[p.participantId] || 0) : undefined
        }));
        // Filter out those with 0? No, backend might expect sum check.
        // For custom/percentage, we send all entries usually.
        setSplits(result);
    }, [values, mode, participants, setSplits]);

    if (mode === 'EQUAL') {
        return <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded">Split equally between everyone.</div>;
    }

    const handleChange = (pid, val) => {
        setValues(prev => ({ ...prev, [pid]: val }));
    };

    const totalVal = Object.values(values).reduce((sum, v) => sum + Number(v), 0);
    const target = mode === 'CUSTOM' ? Number(amount || 0) : 100;
    const diff = target - totalVal;
    const isMatch = Math.abs(diff) < 0.01;

    return (
        <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
            {participants.map(p => (
                <div key={p.participantId} className="flex items-center justify-between">
                    <span className="text-sm">{p.name}</span>
                    <div className="flex items-center gap-1 w-24">
                        <input
                            type="number"
                            value={values[p.participantId] || ''}
                            onChange={e => handleChange(p.participantId, e.target.value)}
                            className="p-1 text-right text-sm"
                            placeholder={mode === 'PERCENTAGE' ? '%' : '0.00'}
                        />
                        <span className="text-gray-400 text-xs">{mode === 'PERCENTAGE' ? '%' : '₹'}</span>
                    </div>
                </div>
            ))}
            <div className={`text-right text-xs font-bold mt-2 ${isMatch ? 'text-green-500' : 'text-red-500'}`}>
                {mode === 'CUSTOM' ? `Total: ₹${totalVal.toFixed(2)} / ₹${target.toFixed(2)}` : `Total: ${totalVal}% / 100%`}
                {!isMatch && <div className="text-red-400">Difference: {diff.toFixed(2)}</div>}
            </div>
        </div>
    );
}

export default function SettlementList({ settlements }) {
    return (
        <div className="bg-white rounded shadow overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Suggested Settlements</h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Efficient</span>
            </div>
            <div className="p-4">
                {settlements.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center">All settled up!</p>
                ) : (
                    <ul className="space-y-3">
                        {settlements.map((s, idx) => (
                            <li key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-700">{s.from}</span>
                                    <span className="text-gray-400">&rarr;</span>
                                    <span className="font-bold text-gray-700">{s.to}</span>
                                </div>
                                <span className="font-bold text-blue-600">₹{s.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

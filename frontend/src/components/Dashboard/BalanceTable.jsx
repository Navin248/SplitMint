export default function BalanceTable({ balances, userId }) {
    return (
        <div className="bg-white rounded shadow overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-800">Net Balances</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                        <th className="p-3">Participant</th>
                        <th className="p-3 text-right">Net Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {balances.map(b => (
                        <tr key={b.participantId} className={b.participantId === userId ? "bg-blue-50" : ""}>
                            <td className="p-3">
                                {b.participantId === userId ? "You" : b.name}
                            </td>
                            <td className={`p-3 text-right font-bold ${b.netBalance > 0 ? 'text-green-500' :
                                    b.netBalance < 0 ? 'text-red-500' : 'text-gray-400'
                                }`}>
                                {b.netBalance > 0 ? '+' : ''}{b.netBalance.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    {balances.length === 0 && (
                        <tr><td colSpan="2" className="p-4 text-center text-gray-400">No participants yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function SummaryCards({ balances, userId }) {
    // balances is array of { participantId, name, netBalance }
    // We need to calculate Total Spent? 
    // API `getGroupBalances` returns net balances. It doesn't return total spent of the group directly.
    // We can calculate "Total Spent" from expenses list if we have it, or backend should provide it.
    // Design says: Section A - Summary Cards (Total Spent, You Owe, You Are Owed).
    // I need to pass expenses or total info to this component.
    // Or I can sum up all positive balances? That equals total money *transferred* or *owed*? No.
    // Total Spent = Sum of all expense amounts. Use expenses array.

    // Let's assume parent passes `expenses` too.

    const myBalanceObj = balances.find(b => b.participantId === userId);
    const myNet = myBalanceObj ? myBalanceObj.netBalance : 0;

    const totalSpent = (arguments[0].expenses || []).reduce((sum, exp) => sum + Number(exp.amount), 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Spend - Clean Card */}
            <div className="card-premium p-6 flex flex-col justify-between h-32 border-b-4 border-indigo-500">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spend</h3>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                <div className="text-xs text-gray-400 font-medium">Group Total</div>
            </div>

            {/* You Owe - Red Accent */}
            <div className="card-premium p-6 flex flex-col justify-between h-32 border-b-4 border-red-500">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">You Owe</h3>
                <div className="flex items-end justify-between">
                    <p className={`text-3xl font-bold ${myNet < 0 ? 'text-red-600' : 'text-gray-300'}`}>
                        {myNet < 0 ? formatCurrency(Math.abs(myNet)) : '-'}
                    </p>
                    {myNet < 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">PAY</span>}
                </div>
            </div>

            {/* Owed to You - Green Accent */}
            <div className="card-premium p-6 flex flex-col justify-between h-32 border-b-4 border-green-500">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">You are Owed</h3>
                <div className="flex items-end justify-between">
                    <p className={`text-3xl font-bold ${myNet > 0 ? 'text-green-600' : 'text-gray-300'}`}>
                        {myNet > 0 ? formatCurrency(myNet) : '-'}
                    </p>
                    {myNet > 0 && <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">RECEIVE</span>}
                </div>
            </div>
        </div>
    );
}

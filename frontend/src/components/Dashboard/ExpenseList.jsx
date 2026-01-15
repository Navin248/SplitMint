import { useState, useMemo, useCallback } from 'react';
import FilterBar from './FilterBar';

export default function ExpenseList({ expenses, userId, participants }) {
    const [expandedId, setExpandedId] = useState(null);
    const [filters, setFilters] = useState({ search: '', participantId: '', dateFrom: '', dateTo: '', sortBy: 'date-desc' });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    const filteredExpenses = useMemo(() => {
        let result = [...expenses];

        // 1. Text Search (Description or Payer Name)
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(exp =>
                exp.description.toLowerCase().includes(term) ||
                (exp.payer?.name && exp.payer.name.toLowerCase().includes(term))
            );
        }

        // 2. Participant Filter (Involved in split OR Payer)
        if (filters.participantId) {
            result = result.filter(exp =>
                exp.payerParticipantId === filters.participantId ||
                exp.splits.some(s => s.participantId === filters.participantId)
            );
        }

        // 3. Date Range
        if (filters.dateFrom) {
            result = result.filter(exp => new Date(exp.date) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            result = result.filter(exp => new Date(exp.date) <= new Date(filters.dateTo));
        }

        // 4. Sorting
        result.sort((a, b) => {
            if (filters.sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (filters.sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (filters.sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
            if (filters.sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
            return 0;
        });

        return result;
    }, [expenses, filters]);

    // Empty States
    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded shadow p-10 text-center border-l-4 border-gray-200">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No expenses yet</h3>
                <p className="text-gray-500">Add your first expense to see balances update.</p>
            </div>
        );
    }

    return (
        <div>
            <FilterBar participants={participants} onFilterChange={handleFilterChange} />

            <div className="bg-white rounded shadow overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Recent Expenses</h3>
                    <span className="text-xs text-gray-400">Showing {filteredExpenses.length} of {expenses.length}</span>
                </div>

                {filteredExpenses.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-bold text-gray-800">No matching expenses</h3>
                        <p className="text-gray-500 mb-4">Try adjusting or clearing your filters.</p>
                        <button
                            onClick={() => handleFilterChange({ search: '', participantId: '', dateFrom: '', dateTo: '', sortBy: 'date-desc' })}
                            className="text-blue-500 font-bold hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredExpenses.map(expense => {
                            const mySplit = expense.splits.find(s => s.participantId === userId);
                            const isPayer = expense.payerParticipantId === userId;

                            return (
                                <div key={expense.id} className="mb-4">
                                    <div
                                        className={`card-premium p-5 flex justify-between items-center cursor-pointer ${expandedId === expense.id ? 'ring-2 ring-indigo-100' : 'hover:bg-gray-50'}`}
                                        onClick={() => toggleExpand(expense.id)}
                                    >
                                        <div className="flex-1 flex items-center gap-4">
                                            {/* Avatar / Icon */}
                                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
                                                {/* Simple category icon based on text or default */}
                                                {expense.description.match(/pizza|food|lunch|dinner/i) ? '🍕' :
                                                    expense.description.match(/taxi|uber|travel/i) ? '🚕' :
                                                        '🧾'}
                                            </div>

                                            <div>
                                                <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                                    {expense.description}
                                                </div>
                                                <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mt-1">
                                                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    <span className="mx-2">•</span>
                                                    <span className={isPayer ? "text-green-600" : ""}>{isPayer ? "You paid" : `${expense.payer?.name} paid`}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-extrabold text-gray-900 text-lg">₹{Number(expense.amount).toFixed(2)}</div>
                                            {mySplit && (
                                                <div className={`text-xs font-bold mt-1 px-2 py-1 rounded-full inline-block ${isPayer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {isPayer ? 'lent' : 'borrowed'} ₹{Number(mySplit.amount).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {expandedId === expense.id && (
                                        <div className="ml-4 mr-4 bg-gray-50 p-4 rounded-b-lg border-x border-b border-gray-100 -mt-2 relative z-0 animate-fadeIn">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Splits Breakdown</h4>
                                            <ul className="space-y-2">
                                                {expense.splits.map(split => (
                                                    <li key={split.id} className="flex justify-between text-sm text-gray-700 items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                                {split.participant?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <span>{split.participant?.name || 'Participant'}</span>
                                                        </div>
                                                        <span className="font-mono font-medium">₹{Number(split.amount).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

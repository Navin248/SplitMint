import { useState, useEffect } from 'react';

export default function FilterBar({ participants, onFilterChange }) {
    const [search, setSearch] = useState('');
    const [participantId, setParticipantId] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFilterChange({ search, participantId, dateFrom, dateTo, sortBy });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, participantId, dateFrom, dateTo, sortBy, onFilterChange]);

    return (
        <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
                {/* Text Search */}
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search description or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-sm"
                    />
                </div>

                {/* Participant Filter */}
                <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Participant</label>
                    <select
                        value={participantId}
                        onChange={(e) => setParticipantId(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                    >
                        <option value="">All Members</option>
                        {participants.map(p => (
                            <option key={p.participantId} value={p.participantId}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="amount-desc">Amount: High to Low</option>
                        <option value="amount-asc">Amount: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Date Range (Collapsed by default? let's show inline for now as per design "Filters stack") */}
            <div className="flex gap-4 items-center">
                <div className="w-1/2 md:w-auto">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                    />
                </div>
                <div className="w-1/2 md:w-auto">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                    />
                </div>
                {(search || participantId || dateFrom || dateTo) && (
                    <button
                        onClick={() => {
                            setSearch('');
                            setParticipantId('');
                            setDateFrom('');
                            setDateTo('');
                            setSortBy('date-desc');
                        }}
                        className="text-red-500 text-sm font-bold mt-5 hover:underline"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}

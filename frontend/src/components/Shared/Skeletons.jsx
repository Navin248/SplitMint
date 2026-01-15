export const ExpenseListSkeleton = () => (
    <div className="bg-white rounded shadow overflow-hidden animate-pulse">
        <div className="p-4 border-b border-gray-100 h-10 bg-gray-100 w-1/3 mb-2"></div>
        <div className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex justify-between">
                    <div className="space-y-2 w-1/2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2 w-1/4 text-right">
                        <div className="h-4 bg-gray-200 rounded w-full ml-auto"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3 ml-auto"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const BalanceTableSkeleton = () => (
    <div className="bg-white rounded shadow overflow-hidden animate-pulse h-48">
        <div className="p-4 border-b border-gray-100 h-10 bg-gray-100 w-1/2"></div>
        <div className="p-4 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
    </div>
);

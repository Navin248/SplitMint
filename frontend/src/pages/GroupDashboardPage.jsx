import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import SummaryCards from '../components/Dashboard/SummaryCards';
import BalanceTable from '../components/Dashboard/BalanceTable';
import SettlementList from '../components/Dashboard/SettlementList';
import ExpenseList from '../components/Dashboard/ExpenseList';
import { ExpenseListSkeleton, BalanceTableSkeleton } from '../components/Shared/Skeletons';
import AddExpenseModal from '../components/Expenses/AddExpenseModal';
import AddParticipantModal from '../components/Groups/AddParticipantModal';

export default function GroupDashboardPage() {
    const { groupId } = useParams();
    const { token, user } = useAuth();

    const [balances, setBalances] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);

    // Identify my participant ID
    const myParticipant = balances.find(p => p.userId === user.id);
    const myParticipantId = myParticipant?.participantId;

    const fetchData = async () => {
        try {
            const [balData, setData, expData] = await Promise.all([
                api.getBalances(token, groupId),
                api.getSettlements(token, groupId),
                api.getExpenses(token, groupId)
            ]);
            setBalances(balData);
            setSettlements(setData);
            setExpenses(expData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId, token]);

    const handleExpenseAdded = (newExpense) => {
        // Refresh data to update balances and list
        fetchData();
    };

    const handleParticipantAdded = (newParticipant) => {
        fetchData();
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-6"></div>
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-24 bg-white rounded shadow animate-pulse"></div>
                    <div className="h-24 bg-white rounded shadow animate-pulse"></div>
                    <div className="h-24 bg-white rounded shadow animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BalanceTableSkeleton />
                    <div className="h-48 bg-white rounded shadow animate-pulse"></div>
                </div>
                <ExpenseListSkeleton />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-max py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/groups" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                            &larr; <span className="sr-only">Back</span>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Group Dashboard</h1>
                    </div>
                    <button
                        onClick={() => setIsAddParticipantOpen(true)}
                        className="btn btn-secondary text-sm py-2 px-4 shadow-none border-gray-200"
                    >
                        + Add Member
                    </button>
                </div>
            </div>

            <div className="container-max mt-8 space-y-8">

                {/* Section A: Summary Cards */}
                <section>
                    <SummaryCards balances={balances} expenses={expenses} userId={myParticipantId} />
                </section>

                {/* Section B & C: Balances & Settlements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* B: Balances Table */}
                    <section className="card-premium p-6">
                        <h3 className="card-title mb-4">Net Balances</h3>
                        <div className="overflow-x-auto">
                            <BalanceTable balances={balances} userId={myParticipantId} />
                        </div>
                    </section>

                    {/* C: Suggested Settlements */}
                    <section className="card-premium p-6 bg-gray-50/50 border-dashed">
                        <h3 className="card-title mb-4">Suggested Settlements</h3>
                        <SettlementList settlements={settlements} />
                    </section>
                </div>

                {/* Section D: Recent Activity */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                    </div>
                    <ExpenseList expenses={expenses} userId={myParticipantId} participants={balances} />
                </section>

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsAddExpenseOpen(true)}
                    className="fixed bottom-8 right-8 btn btn-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold z-50 hover:scale-105 transition-transform"
                    title="Add Expense"
                >
                    +
                </button>

                {/* Modals */}
                <AddExpenseModal
                    isOpen={isAddExpenseOpen}
                    onClose={() => setIsAddExpenseOpen(false)}
                    onExpenseAdded={handleExpenseAdded}
                    groupId={groupId}
                    participants={balances}
                    myParticipantId={myParticipantId}
                />

                <AddParticipantModal
                    isOpen={isAddParticipantOpen}
                    onClose={() => setIsAddParticipantOpen(false)}
                    onParticipantAdded={handleParticipantAdded}
                    groupId={groupId}
                />
            </div>
        </div>
    );
}

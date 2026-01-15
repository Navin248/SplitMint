import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import GroupCard from '../components/Groups/GroupCard';
import CreateGroupModal from '../components/Groups/CreateGroupModal';

export default function GroupsPage() {
    const { token, logout, user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, [token]);

    const fetchGroups = async () => {
        try {
            const data = await api.getGroups(token);
            setGroups(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupCreated = (newGroup) => {
        // Add new group to list (optimistic or re-fetch)
        // New group might lack detailed participants structure if backend response varies,
        // but usually create returns the object.
        // Let's re-fetch to be safe or append if structure matches.
        // For now, re-fetch or append. Append is faster.
        setGroups(prev => [newGroup, ...prev]);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-max flex justify-between items-center py-4">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">My Groups</h1>
                    <div className="flex gap-4 items-center">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-700">{user?.email}</p>
                            <button onClick={logout} className="text-xs text-red-500 font-medium hover:text-red-600">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-max mt-8">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading your groups...</div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Create Group Action Card */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group h-full min-h-[160px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mb-3 group-hover:scale-110 transition-transform">
                                +
                            </div>
                            <span className="font-bold text-gray-700 group-hover:text-indigo-700">Create New Group</span>
                        </button>

                        {/* Group Cards */}
                        {groups.map(group => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>
                )}

                {!loading && groups.length === 0 && (
                    <div className="mt-12 text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            👋
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to SplitMint</h3>
                        <p className="text-gray-500">Create a group above to start splitting expenses with friends, roommates, or travel buddies.</p>
                    </div>
                )}

                <CreateGroupModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGroupCreated={handleGroupCreated}
                />
            </div>
        </div>
    );
}

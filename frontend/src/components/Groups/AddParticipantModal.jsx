import { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AddParticipantModal({ isOpen, onClose, onParticipantAdded, groupId }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Backend expects { name }
            const newParticipant = await api.addParticipant(token, groupId, { name });
            onParticipantAdded(newParticipant);
            setName('');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to add participant. Limit might be reached (Max 4).');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Add Member</h2>
                <form onSubmit={handleSubmit}>
                    <p className="text-sm text-gray-500 mb-4">
                        Add a new person to this group to split expenses with.
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Bob"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';

export default function GroupCard({ group }) {
    // Group object structure based on backend:
    // { id, name, createdBy, creator: {..}, participants: [...], expenses: [...] (if included), createdAt }
    // Backend group list might fetch simple details.
    // We need "Your Net Position" here? Backend `getMyGroups` (groupController) currently returns just group data.
    // It doesn't calculate balances.
    // To show "Net Position", we'd need to fetch balances for each group or have backend provide it.
    // For now, let's just show basic info (Name, Member count) as per MVP, or fetch balances if needed.
    // Phase 5 plan: "Data: Group Name, Participant Count, Your Net Position."

    // Implementation Strategy:
    // We can fetch balances for all groups or just show static info first. 
    // Optimization: `getGroupBalances` is per group.
    // Let's stick to Name + Link for now and add Position later if performant (or N+1 fetch).

    return (
        <Link to={`/groups/${group.id}`} className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {group.participants?.length || 0} Members
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">Created {new Date(group.createdAt).toLocaleDateString()}</p>
            </div>
        </Link>
    );
}

export const generateSettlements = (balances, participants) => {
    const creditors = [];
    const debtors = [];

    for (const [pid, balance] of Object.entries(balances)) {
        // Floating point safety for near-zero values
        if (Math.abs(balance) < 0.01) continue;

        if (balance > 0) creditors.push({ pid, balance });
        if (balance < 0) debtors.push({ pid, balance: -balance });
    }

    // Sort to optimize greedy matching (optional but good for stability)
    // creditors.sort((a, b) => b.balance - a.balance);
    // debtors.sort((a, b) => b.balance - a.balance);

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what debtor owes and creditor is owed
        const amount = Math.min(debtor.balance, creditor.balance);

        // Only add non-trivial settlements
        if (amount > 0.005) {
            settlements.push({
                from: participants[debtor.pid], // Name
                to: participants[creditor.pid],   // Name
                amount: +amount.toFixed(2)
            });
        }

        debtor.balance -= amount;
        creditor.balance -= amount;

        // Move to next if fully settled (using small epsilon for float comparison)
        if (debtor.balance < 0.01) i++;
        if (creditor.balance < 0.01) j++;
    }

    return settlements;
};

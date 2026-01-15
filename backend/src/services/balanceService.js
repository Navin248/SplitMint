export const computeBalances = (expenses) => {
    const balances = {};

    expenses.forEach(exp => {
        const total = Number(exp.amount);

        // Initialize participants
        exp.splits.forEach(s => {
            if (!balances[s.participantId]) balances[s.participantId] = 0;
        });

        if (!balances[exp.payerParticipantId]) {
            balances[exp.payerParticipantId] = 0;
        }

        // Payer paid total (Positive calculation: Paid - Owed)
        // Detailed logic:
        // Payer 'gives' the total amount to the group content.
        // balance += total
        balances[exp.payerParticipantId] += total;

        // Everyone 'takes' their split from the pot (owes it back)
        // balance -= split.amount
        exp.splits.forEach(s => {
            balances[s.participantId] -= Number(s.amount);
        });
    });

    return balances;
};

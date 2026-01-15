export const calculateSplits = (total, mode, splits) => {
    const amount = Number(total);

    if (mode === "EQUAL") {
        const n = splits.length;
        // Base amount rounded down to 2 decimals
        const base = Math.floor((amount / n) * 100) / 100;
        // Calculate total distributed so far
        const totalDistributed = base * n;
        // Calculate remainder (handling floating point precision)
        let remainder = +(amount - totalDistributed).toFixed(2);

        // Remainder will be in cents, e.g., 0.02
        // We distribute 0.01 to the first 'remainder * 100' participants

        return splits.map((s) => {
            // If we still have remainder cents to distribute, give one to this participant
            const extra = remainder >= 0.01 ? 0.01 : 0;
            // Decrement remainder
            if (extra > 0) remainder = +(remainder - 0.01).toFixed(2);

            return {
                participantId: s.participantId,
                amount: +(base + extra).toFixed(2)
            };
        });
    }

    if (mode === "CUSTOM") {
        const sum = splits.reduce((a, s) => a + Number(s.amount), 0);
        // Tolerance for floating point (e.g., 33.33 + 33.33 + 33.34 = 100)
        // Actually, input should be exact 2 decimals, so we check equality rigorously or with tiny epsilon
        if (Math.abs(sum - amount) > 0.009) {
            throw new Error(`Custom split sum (${sum}) does not match total expense amount (${amount})`);
        }

        return splits.map(s => ({
            participantId: s.participantId,
            amount: Number(s.amount)
        }));
    }

    if (mode === "PERCENTAGE") {
        const percentSum = splits.reduce((a, s) => a + Number(s.percentage), 0);
        if (Math.abs(percentSum - 100) > 0.01) {
            throw new Error(`Percentages sum to ${percentSum}, must be 100%`);
        }

        // Calculate raw amounts
        let rawSplits = splits.map(s => ({
            participantId: s.participantId,
            rawAmount: (Number(s.percentage) / 100) * amount
        }));

        // Round down to 2 decimals initially
        let currentSum = 0;
        const resultSplits = rawSplits.map(s => {
            const val = Math.floor(s.rawAmount * 100) / 100;
            currentSum += val;
            return { participantId: s.participantId, amount: val };
        });

        // Distribute remainder (rounding errors)
        let remainder = +(amount - currentSum).toFixed(2); // e.g. 0.02

        // Distribute remainder to those with largest decimal parts (standard largest-remainder method)
        // or just sequentially for simplicity as per requirement. The user prompt implied simple deterministic distribution.
        // Let's stick to the sequential logic for stability like EQUAL split unless complex "largest remainder" is strictly needed.
        // User code example used simple .toFixed(2) which might drift.
        // I will implement a robust remainder distribution similar to EQUAL to ensure sum == total.

        for (let i = 0; i < resultSplits.length; i++) {
            if (remainder < 0.01) break;
            resultSplits[i].amount = +(resultSplits[i].amount + 0.01).toFixed(2);
            remainder = +(remainder - 0.01).toFixed(2);
        }

        return resultSplits;
    }

    throw new Error("Invalid split mode. Must be EQUAL, CUSTOM, or PERCENTAGE.");
};

import prisma from "../services/prisma.js";
import { computeBalances } from "../services/balanceService.js";
import { generateSettlements } from "../services/settlementService.js";

export const getGroupBalances = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        const expenses = await prisma.expense.findMany({
            where: { groupId },
            include: { splits: true }
        });

        const participants = await prisma.participant.findMany({
            where: { groupId }
        });

        const balances = computeBalances(expenses);

        res.json(
            participants.map(p => ({
                participantId: p.id,
                userId: p.userId,
                name: p.name,
                netBalance: +(balances[p.id] || 0).toFixed(2)
            }))
        );
    } catch (err) {
        console.error("Get Balances Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getSettlements = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        const expenses = await prisma.expense.findMany({
            where: { groupId },
            include: { splits: true }
        });

        const participants = await prisma.participant.findMany({
            where: { groupId }
        });

        const participantMap = {};
        participants.forEach(p => {
            participantMap[p.id] = p.name;
        });

        const balances = computeBalances(expenses);
        const settlements = generateSettlements(balances, participantMap);

        res.json(settlements);
    } catch (err) {
        console.error("Get Settlements Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

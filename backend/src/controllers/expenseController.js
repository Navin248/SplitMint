import prisma from "../services/prisma.js";
import { calculateSplits } from "../services/splitService.js";

export const addExpense = async (req, res) => {
    try {
        const {
            amount,
            description,
            date,
            payerParticipantId,
            splitMode,
            splits // Expected: [{ participantId, amount (if custom), percentage (if %) }]
        } = req.body;
        const { groupId } = req.params;

        // 1. Calculate and validate splits
        const computedSplits = calculateSplits(amount, splitMode, splits);

        // 2. Create Expense and Splits Transactionally
        // Note: Prisma Nested writes are transactional by default.
        const expense = await prisma.expense.create({
            data: {
                groupId,
                payerParticipantId,
                amount,
                description,
                date: new Date(date),
                splits: {
                    create: computedSplits
                }
            },
            include: {
                splits: true
            }
        });

        res.json(expense);
    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(400).json({ error: err.message });
    }
};

export const editExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const {
            amount,
            description,
            date,
            payerParticipantId,
            splitMode,
            splits
        } = req.body;

        const computedSplits = calculateSplits(amount, splitMode, splits);

        // Transaction: Delete old splits -> Update Expense -> Create new splits
        // Prisma update with nested create/delete is one way, but deleteMany + update is cleaner for full replacement.
        // Using $transaction to ensure atomicity.
        const result = await prisma.$transaction(async (tx) => {
            // 1. Delete existing splits
            await tx.expenseSplit.deleteMany({ where: { expenseId } });

            // 2. Update expense details and create new splits
            const updatedExpense = await tx.expense.update({
                where: { id: expenseId },
                data: {
                    amount,
                    description,
                    date: new Date(date),
                    payerParticipantId,
                    splits: {
                        create: computedSplits
                    }
                },
                include: { splits: true }
            });
            return updatedExpense;
        });

        res.json(result);
    } catch (err) {
        console.error("Edit Expense Error:", err);
        res.status(400).json({ error: err.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        // Cascade delete in Schema is set (Expense -> ExpenseSplit), so deleting expense is enough.
        await prisma.expense.delete({ where: { id: expenseId } });
        res.json({ message: "Expense deleted" });
    } catch (err) {
        console.error("Delete Expense Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const { groupId } = req.params;
        const expenses = await prisma.expense.findMany({
            where: { groupId },
            include: {
                splits: { include: { participant: true } },
                payer: true
            },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (err) {
        console.error("Get Expenses Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

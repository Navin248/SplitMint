import prisma from "../services/prisma.js";

// Mock AI Controller - "Smart Pattern Matcher"
// Fallback when real AI is unavailable or rate-limited.

export const parseExpense = async (req, res) => {
    try {
        const { text, groupId } = req.body;

        if (!text) return res.status(400).json({ error: "Text is required" });

        // 1. Fetch participants to match names
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { participants: true }
        });
        const participants = group ? group.participants : [];

        // 2. Extract Amount (first number found)
        const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

        // 3. Extract Description
        let cleanText = text.replace(/paid|for|with|split|by|share/gi, " ");
        if (amount !== null) {
            cleanText = cleanText.replace(String(amount), " ");
        }
        cleanText = cleanText.trim();

        // Remove participant names from description
        participants.forEach(p => {
            const nameReg = new RegExp(p.name, "gi");
            cleanText = cleanText.replace(nameReg, " ");
        });
        const description = cleanText.replace(/\s+/g, " ").trim() || "Expense";

        // 4. Extract Payer
        let payerName = "You"; // Default
        if (text.match(/paid by me/i) || text.match(/i paid/i)) {
            payerName = "You";
        } else {
            const foundPayer = participants.find(p => new RegExp(`paid by ${p.name}`, "i").test(text));
            if (foundPayer) payerName = foundPayer.name;
        }

        // 5. involved names (simple "with Bob")
        const involvedNames = ["You"]; // Always include self in default logic unless specified
        participants.forEach(p => {
            if (new RegExp(p.name, "i").test(text)) {
                if (!involvedNames.includes(p.name)) involvedNames.push(p.name);
            }
        });

        // Special case: "Split with all"
        let splitMode = "EQUAL";
        if (involvedNames.length === 1 && involvedNames[0] === "You") {
            // If no one else mentioned, assume group split? Or just user expense?
            // Let's assume group split for "Paid 500 for Lunch"
            involvedNames.length = 0; // Reset to let frontend handle "All"
        }

        const suggestedExpense = {
            amount,
            description: description.charAt(0).toUpperCase() + description.slice(1),
            date: new Date().toISOString().split('T')[0],
            payerName,
            splitMode,
            involvedNames
        };

        // Simulate network delay for "AI feel"
        setTimeout(() => {
            res.json({ suggestedExpense });
        }, 800);

    } catch (error) {
        console.error("Mock AI Error:", error);
        res.status(500).json({ error: "Failed to parse expense" });
    }
};

import prisma from "../services/prisma.js";

export const addParticipant = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, color } = req.body;

        const count = await prisma.participant.count({ where: { groupId } });
        if (count >= 4) {
            return res.status(400).json({ error: "Group already has max participants" });
        }

        const participant = await prisma.participant.create({
            data: { name, color, groupId }
        });

        res.json(participant);
    } catch (error) {
        console.error("Add participant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editParticipant = async (req, res) => {
    try {
        const { participantId } = req.params;
        const { name, color } = req.body;

        const updated = await prisma.participant.update({
            where: { id: participantId },
            data: { name, color }
        });

        res.json(updated);
    } catch (error) {
        console.error("Edit participant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeParticipant = async (req, res) => {
    try {
        const { participantId } = req.params;

        // Expense safety will be enforced in Phase 3
        await prisma.participant.delete({ where: { id: participantId } });

        res.json({ message: "Participant removed" });
    } catch (error) {
        console.error("Remove participant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

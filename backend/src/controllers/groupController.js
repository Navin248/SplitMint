import prisma from "../services/prisma.js";

export const createGroup = async (req, res) => {
    try {
        const { name, participants = [] } = req.body;
        const userId = req.userId;

        if (participants.length > 3) {
            return res.status(400).json({ error: "Max 3 additional participants allowed" });
        }

        const group = await prisma.group.create({
            data: {
                name,
                createdBy: userId,
                participants: {
                    create: [
                        { name: "You", userId: userId },
                        ...participants
                    ]
                }
            },
            include: { participants: true }
        });

        res.json(group);
    } catch (error) {
        console.error("Create group error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMyGroups = async (req, res) => {
    try {
        const userId = req.userId;
        const groups = await prisma.group.findMany({
            where: { createdBy: userId },
            include: { participants: true }
        });

        res.json(groups);
    } catch (error) {
        console.error("Get groups error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.userId;

        const group = await prisma.group.findFirst({
            where: { id: groupId, createdBy: userId }
        });

        if (!group) {
            return res.status(403).json({ error: "Unauthorized or not found" });
        }

        await prisma.group.delete({ where: { id: groupId } });
        res.json({ message: "Group deleted" });
    } catch (error) {
        console.error("Delete group error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

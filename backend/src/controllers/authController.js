import prisma from "../services/prisma.js";
import { hashPassword, comparePassword } from "../services/password.js";
import { generateToken } from "../services/jwt.js";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: await hashPassword(password),
            },
        });

        res.json({ id: user.id, email: user.email });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePassword(password, user.passwordHash))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            token: generateToken(user.id),
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

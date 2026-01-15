import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import balanceRoutes from "./routes/balanceRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/participants", participantRoutes);
app.use("/expenses", expenseRoutes);
app.use("/groups", balanceRoutes);

// AI Route
import { parseExpense } from "./controllers/aiController.js";
app.post("/ai/parse-expense", authMiddleware, parseExpense);

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "SplitMint backend running" });
});

app.get("/me", authMiddleware, (req, res) => {
    res.json({ userId: req.userId });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

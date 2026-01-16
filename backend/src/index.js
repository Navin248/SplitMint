import "dotenv/config";
import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import balanceRoutes from "./routes/balanceRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

// AI Controller
import { parseExpense } from "./controllers/aiController.js";

const app = express();

/* ======================================================
   CORS CONFIGURATION (RAILWAY + PROD SAFE)
====================================================== */

const allowedOrigins = [
    "https://frontend-production-d882.up.railway.app", // Railway frontend
    "https://split-mint-eosin.vercel.app",              // Vercel (old)
    "http://localhost:5173"                             // Local dev
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow server-to-server / Postman
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// ✅ REQUIRED: handle preflight requests
app.options("*", cors());

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(express.json());

/* ======================================================
   ROUTES
====================================================== */

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/participants", participantRoutes);
app.use("/expenses", expenseRoutes);
app.use("/groups", balanceRoutes);

// AI Route (Protected)
app.post("/ai/parse-expense", authMiddleware, parseExpense);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "SplitMint backend running" });
});

// Auth test
app.get("/me", authMiddleware, (req, res) => {
    res.json({ userId: req.userId });
});

/* ======================================================
   SERVER START
====================================================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 SplitMint backend running on port ${PORT}`);
});

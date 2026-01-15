import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addExpense,
    editExpense,
    deleteExpense,
    getExpenses
} from "../controllers/expenseController.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/:groupId", addExpense);
router.get("/:groupId", getExpenses);
router.put("/:expenseId", editExpense);
router.delete("/:expenseId", deleteExpense);

export default router;

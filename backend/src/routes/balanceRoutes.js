import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getGroupBalances,
    getSettlements
} from "../controllers/balanceController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/:groupId/balances", getGroupBalances);
router.get("/:groupId/settlements", getSettlements);

export default router;

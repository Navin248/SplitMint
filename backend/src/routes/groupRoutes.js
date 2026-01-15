import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createGroup,
    getMyGroups,
    deleteGroup
} from "../controllers/groupController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.delete("/:groupId", deleteGroup);

export default router;

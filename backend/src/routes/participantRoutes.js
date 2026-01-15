import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addParticipant,
    editParticipant,
    removeParticipant
} from "../controllers/participantController.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/:groupId", addParticipant);
router.put("/:participantId", editParticipant);
router.delete("/:participantId", removeParticipant);

export default router;

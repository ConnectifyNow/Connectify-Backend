import express from "express";
import aiController from "../controllers/ai.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:orgName", aiController.getAiDescription);

export default router;

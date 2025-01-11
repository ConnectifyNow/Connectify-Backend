import express from "express";
import skillController from "../controllers/skill.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", skillController.getSkillOverview);
router.post("/", skillController.create.bind(skillController));
router.put("/:id", skillController.putById.bind(skillController));
router.delete("/:id", skillController.deleteById.bind(skillController));

export default router;

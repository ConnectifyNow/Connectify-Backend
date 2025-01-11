import express from "express";
import skillController from "../controllers/skill.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, skillController.getSkillOverview);
router.post("/", authMiddleware, skillController.create.bind(skillController));
router.put(
  "/:id",
  authMiddleware,
  skillController.putById.bind(skillController)
);
router.delete(
  "/:id",
  authMiddleware,
  skillController.deleteById.bind(skillController)
);

export default router;

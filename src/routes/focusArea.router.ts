import express from "express";
import focusAreaController from "../controllers/focusArea.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", focusAreaController.getFocusAreas);
router.post("/", focusAreaController.create.bind(focusAreaController));
router.put("/:id", focusAreaController.putById.bind(focusAreaController));
router.delete("/:id", focusAreaController.deleteById.bind(focusAreaController));

export default router;

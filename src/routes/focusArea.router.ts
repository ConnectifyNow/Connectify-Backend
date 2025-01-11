import express from "express";
import focusAreaController from "../controllers/focusArea.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, focusAreaController.getFocusAreas);
router.post(
  "/",
  authMiddleware,
  focusAreaController.create.bind(focusAreaController)
);
router.put(
  "/:id",
  authMiddleware,
  focusAreaController.putById.bind(focusAreaController)
);
router.delete(
  "/:id",
  authMiddleware,
  focusAreaController.deleteById.bind(focusAreaController)
);

export default router;

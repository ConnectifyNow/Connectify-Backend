import express from "express";
import cityController from "../controllers/city.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, cityController.getCityOverview);
router.post("/", authMiddleware, cityController.create.bind(cityController));
router.put("/:id", authMiddleware, cityController.putById.bind(cityController));
router.delete(
  "/:id",
  authMiddleware,
  cityController.deleteById.bind(cityController)
);

export default router;

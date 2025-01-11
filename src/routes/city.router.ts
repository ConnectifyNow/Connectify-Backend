import express from "express";
import cityController from "../controllers/city.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, cityController.getCitiesOverview);
router.get("/user/:id", authMiddleware, cityController.getCitiesByUserId);

export default router;

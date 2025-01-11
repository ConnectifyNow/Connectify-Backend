import express from "express";
import cityController from "../controllers/city.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", cityController.getCitiesOverview);
router.get("/user/:id", cityController.getCitiesByUserId);

export default router;

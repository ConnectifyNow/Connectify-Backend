import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", userController.getUserOverview);
router.put("/:id", userController.putById.bind(userController));

export default router;

import express from "express";
import userController, {
  getUserOverview,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, getUserOverview);
router.put("/:id", authMiddleware, userController.putById.bind(userController));

export default router;

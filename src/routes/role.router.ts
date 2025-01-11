import express from "express";
import roleController from "../controllers/role.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/overview", authMiddleware, roleController.getRoleOverview.bind(roleController));
router.get("/:name", authMiddleware, roleController.getRoleByName.bind(roleController));

export default router;

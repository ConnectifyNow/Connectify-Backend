import express from "express";
import roleController from "../controllers/role.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, roleController.getRoleOverview);
router.get("/:name", authMiddleware, roleController.getRoleByName);
router.post("/", authMiddleware, roleController.createRole);

export default router;

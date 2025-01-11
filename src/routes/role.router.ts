import express from "express";
import roleController from "../controllers/role.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", roleController.getRoleOverview);
router.get("/:name", roleController.getRoleByName);
router.post("/", roleController.createRole);

export default router;

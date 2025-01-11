import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", roleController.getRoleOverview);
// router.get("/user/:userId", authMiddleware, roleController.getPostsByUserId);
router.post("/", roleController.create.bind(roleController));
router.put("/:id", roleController.putById.bind(roleController));
router.delete("/:id", roleController.deleteById.bind(roleController));

export default router;

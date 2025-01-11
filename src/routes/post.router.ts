import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, postController.getPostsOverview);
router.post("/", authMiddleware, postController.create.bind(postController));
router.put("/:id", authMiddleware, postController.putById.bind(postController));
router.delete(
  "/:id",
  authMiddleware,
  postController.deleteById.bind(postController)
);
router.get("/user/:userId", authMiddleware, postController.getPostsByUserId);
router.post("/comment", authMiddleware, postController.addComment);
router.put("/like/:userId", authMiddleware, postController.likePost);
router.get("/likes/:postId", authMiddleware, postController.getLikesByPostId);
export default router;

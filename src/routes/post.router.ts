import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:postId?", authMiddleware, postController.getPostsOverview);
router.post("/", authMiddleware, postController.create.bind(postController));
router.put("/:id", authMiddleware, postController.putById.bind(postController));
router.delete(
  "/:id",
  authMiddleware,
  postController.deleteById.bind(postController)
);
router.get("/user/:userId", authMiddleware, postController.getPostsByUserId);
// router.post("/:postId/comment", authMiddleware, postController.addComment);
router.put("/:postId/like", authMiddleware, postController.likePost);
router.get("/likes/:postId", authMiddleware, postController.getLikesByPostId);
router.get(
  "/comments/:postId",
  authMiddleware,
  postController.getPostWithComments
);

export default router;

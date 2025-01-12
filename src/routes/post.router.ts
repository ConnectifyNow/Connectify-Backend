import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:postId?", postController.getPostsOverview);
router.post("/", postController.create.bind(postController));
router.put("/:id", postController.putById.bind(postController));
router.delete("/:id", postController.deleteById.bind(postController));
router.get("/user/:userId", postController.getPostsByUserId);
router.post("/comment/:postId", postController.addComment);
router.put("/like/:userId", postController.likePost);
router.get("/likes/:postId", postController.getLikesByPostId);
router.get("/comments/:postId", postController.getPostWithComments);

export default router;

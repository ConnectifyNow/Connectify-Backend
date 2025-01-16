import express from "express";
import commentController from "../controllers/comment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, commentController.getCommentById);
router.get(
  "/post/:postId",
  authMiddleware,
  commentController.getCommentsByPostId
);
router.post(
  "/",
  authMiddleware,
  commentController.create.bind(commentController)
);
router.put(
  "/:id",
  authMiddleware,
  commentController.putById.bind(commentController)
);
router.delete(
  "/:id",
  authMiddleware,
  commentController.deleteById.bind(commentController)
);
router.put("/:commentId/like", authMiddleware, commentController.likeComment);

export default router;

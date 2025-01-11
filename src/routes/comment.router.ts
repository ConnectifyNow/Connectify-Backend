import express from "express";
import commentController from "../controllers/comment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, commentController.getCommentById);
router.get(
  "/post/:postId",
  authMiddleware,
  commentController.getCommentsByPost
);
router.post(
  "/",
  authMiddleware,
  commentController.create.bind(commentController)
);
router.put(
  "/:id",
  authMiddleware,
  commentController.updateComment.bind(commentController)
);
router.delete(
  "/:id",
  authMiddleware,
  commentController.deleteComment.bind(commentController)
);

export default router;

import express from "express";
import commentController from "../controllers/comment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", commentController.getCommentById);
router.get(
  "/post/:postId",

  commentController.getCommentsByPostId
);
router.post("/", commentController.create.bind(commentController));
router.put("/:id", commentController.putById.bind(commentController));
router.delete("/:id", commentController.deleteById.bind(commentController));

export default router;

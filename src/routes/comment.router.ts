import express from "express";
import commentController from "../controllers/comment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         user:
 *           type: string
 *           description: The id of the user who made the comment
 *         post:
 *           type: string
 *           description: The id of the post the comment belongs to
 *         text:
 *           type: string
 *           description: The text of the comment
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of the users who liked the comment
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the comment was created
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.get("/:id?", authMiddleware, commentController.getCommentById);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: No comments found for this post
 *       500:
 *         description: Internal server error
 */
router.get(
  "/post/:postId",
  authMiddleware,
  commentController.getCommentsByPostId
);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  commentController.create.bind(commentController)
);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  commentController.putById.bind(commentController)
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  commentController.deleteById.bind(commentController)
);

/**
 * @swagger
 * /api/comments/{commentId}/like:
 *   put:
 *     summary: Like a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The id of the user liking the comment
 *     responses:
 *       200:
 *         description: The liked comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment ID or user ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put("/:commentId/like", authMiddleware, commentController.likeComment);

export default router;

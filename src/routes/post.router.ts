import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";
import commentController from "../controllers/comment.controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         user:
 *           type: string
 *           description: The id of the user who created the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         imageUrl:
 *           type: string
 *           description: The image URL of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the post was created
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: The skills related to the post
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of the users who liked the post
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.get("/:postId?", authMiddleware, postController.getPostsOverview);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, postController.create.bind(postController));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, postController.putById.bind(postController));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  postController.deleteById.bind(postController)
);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user
 *     responses:
 *       200:
 *         description: List of posts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No posts found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", authMiddleware, postController.getPostsByUserId);

/**
 * @swagger
 * /api/posts/{postId}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
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
 *       400:
 *         description: Invalid post ID
 *       500:
 *         description: Internal server error
 */
router.post("/:postId/comment", authMiddleware, commentController.addComment);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   put:
 *     summary: Like a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The id of the user liking the post
 *     responses:
 *       200:
 *         description: The liked post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post ID or user ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:postId/like", authMiddleware, postController.likePost);

/**
 * @swagger
 * /api/posts/likes/{postId}:
 *   get:
 *     summary: Get likes by post ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post
 *     responses:
 *       200:
 *         description: List of likes for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: No likes found for this post
 *       500:
 *         description: Internal server error
 */
router.get("/likes/:postId", authMiddleware, postController.getLikesByPostId);
export default router;

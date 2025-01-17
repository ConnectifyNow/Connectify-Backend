import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import chatController from "../controllers/chat.controller";
import conversationGuardMiddleware from "../middlewares/conversation_guard.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chat
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of the users in the chat
 *         messages:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of the messages in the chat
 *         openedAt:
 *           type: string
 *           format: date-time
 *           description: The date the chat was opened
 */

/**
 * @swagger
 * /api/chats/conversation:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Internal server error
 */
router.get("/conversation", authMiddleware, chatController.getConversations);

/**
 * @swagger
 * /api/chats/conversation/with/{userId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     tags: [Chat]
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
 *         description: The conversation with the specified user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.getConversationWith
);

/**
 * @swagger
 * /api/chats/conversation/{id}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the conversation
 *     responses:
 *       200:
 *         description: List of messages in the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/conversation/:id/messages",
  authMiddleware,
  conversationGuardMiddleware,
  chatController.getMessages
);

/**
 * @swagger
 * /api/chats/conversation/with/{userId}:
 *   post:
 *     summary: Start a conversation with a specific user
 *     tags: [Chat]
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
 *         description: The started conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.addConversation
);

export default router;

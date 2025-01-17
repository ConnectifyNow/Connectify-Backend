import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import chatController from "../controllers/chat.controller";
import conversationGuardMiddleware from "../middlewares/conversation_guard.middleware";

const router = express.Router();

router.get("/conversation", authMiddleware, chatController.getConversations);

router.get(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.getConversationWith
);

router.get(
  "/conversation/:id/messages",
  authMiddleware,
  conversationGuardMiddleware,
  chatController.getMessages
);

router.post(
  "/conversation/with/:userId",
  authMiddleware,
  chatController.addConversation
);

export default router;

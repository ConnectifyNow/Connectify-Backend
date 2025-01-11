import express from "express";
import chatController from "../controllers/chat.controller";
import authMiddleware from "../middlewares/auth.middleware";
import messageController from "../controllers/message.controller";

const router = express.Router();

router.get("/:id?", chatController.getChat);
router.get("/user/:userId", chatController.getChatsByUser);
router.get("/:chatId/messages", messageController.getMessagesByChatId);

export default router;

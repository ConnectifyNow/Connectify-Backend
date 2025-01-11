import express from "express";
import chatController from "../controllers/chat.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id", authMiddleware, chatController.getChat);
router.get("/user/userId", authMiddleware, chatController.getChatByUser);
router.post("/", authMiddleware, chatController.create.bind(chatController));
router.put("/:id", authMiddleware, chatController.putById.bind(chatController));
router.delete(
  "/:id",
  authMiddleware,
  chatController.deleteById.bind(chatController)
);

export default router;

import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import ChatModel, { IChat } from "../models/chat";
import { BaseController } from "./base.controller";

export class ChatController extends BaseController<IChat> {
  constructor(model: Model<IChat>) {
    super(model);
  }

  getChat = async (req: Request, res: Response) => {
    if (req.params.id) {
      return chatController.getById(req, res, ["_id", "userIds"]);
    }
    return res.status(400).send({ message: "Chat ID is required" });
  };

  getChatsByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    try {
      const chats = await this.model.find({ userIds: userId });
      if (!chats.length) {
        return res
          .status(404)
          .send({ message: "No chats found for this user" });
      }
      return res.status(200).send(chats);
    } catch (error) {
      return res.status(500).send({ message: "Error retrieving chats", error });
    }
  };
}

const chatController = new ChatController(ChatModel);

export default chatController;

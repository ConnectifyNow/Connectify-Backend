import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import MessageModel, { IMessage } from "../models/message";
import { BaseController } from "./base.controller";

export class MessageController extends BaseController<IMessage> {
  constructor(model: Model<IMessage>) {
    super(model);
  }

  getMessagesByChatId = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).send({ message: "Invalid chat ID" });
    }

    try {
      const messages = await this.model.find({ chatId });
      if (!messages.length) {
        return res
          .status(404)
          .send({ message: "No messages found for this chat" });
      }
      return res.status(200).send(messages);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error retrieving messages", error });
    }
  };
}

const messageController = new MessageController(MessageModel);

export default messageController;

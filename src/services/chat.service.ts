import ChatModel from "../models/chat";
import MessageModel, { IMessage } from "../models/message";

const sendMessageToConversation = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  try {
    const conversation = await ChatModel.findById(conversationId).populate(
      "users",
      ["_id", "username", "role"]
    );
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const message: IMessage = new MessageModel({
      content,
      sender: senderId
    });
    console.log(message);

    const savedMessage = await (
      await message.save()
    ).populate("sender", ["_id", "username", "role"]);

    conversation.messages.push(savedMessage.id);
    await conversation.save();

    return savedMessage;
  } catch (error) {
    throw new Error(error);
  }
};

export { sendMessageToConversation };

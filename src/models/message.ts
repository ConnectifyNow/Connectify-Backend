import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: string;
  chatId: string;
  text: string;
  date: Date;
}

const MessageSchema: Schema = new Schema({
  userId: { type: Schema.Types.UUID, ref: "User", required: true },
  chatId: { type: Schema.Types.UUID, ref: "Chat", required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);

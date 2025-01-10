import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  user_id: string;
  chat_id: string;
  text: string;
  date: Date;
}

const MessageSchema: Schema = new Schema({
  user_id: { type: Schema.Types.UUID, ref: "User", required: true },
  chat_id: { type: Schema.Types.UUID, ref: "Chat", required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);

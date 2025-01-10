import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  user_ids: string[];
}

const ChatSchema: Schema = new Schema({
  user_ids: [{ type: Schema.Types.UUID, ref: "User", required: true }],
});

export default mongoose.model<IChat>("Chat", ChatSchema);

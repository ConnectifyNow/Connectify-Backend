import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userIds: string[];
}

const ChatSchema: Schema = new Schema({
  userIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
});

export default mongoose.model<IChat>("Chat", ChatSchema);

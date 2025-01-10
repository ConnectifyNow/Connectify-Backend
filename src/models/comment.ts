import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  user_id: string;
  post_id: string;
  text: string;
  likes: string[];
}

const CommentSchema: Schema = new Schema({
  user_id: { type: Schema.Types.UUID, ref: "User", required: true },
  post_id: { type: Schema.Types.UUID, ref: "Post", required: true },
  text: { type: String, required: true },
  likes: [{ type: Schema.Types.UUID, ref: "User" }],
});

export default mongoose.model<IComment>("Comment", CommentSchema);

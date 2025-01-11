import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  userId: string;
  postId: string;
  text: string;
  likes: string[];
}

const CommentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model<IComment>("Comment", CommentSchema);

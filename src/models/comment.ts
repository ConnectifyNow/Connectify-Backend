import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  userId: string;
  postId: string;
  text: string;
  likes: string[];
  date: Date;
}

const CommentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>("Comment", CommentSchema);

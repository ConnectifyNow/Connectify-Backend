import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  imageUrl?: string;
  content: string;
  date: string;
  skills: string[];
  likes: string[];
}

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String },
  content: { type: String, required: true },
  date: { type: String },
  skills: [{ type: String, ref: "Skill", required: true }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPost>("Post", PostSchema);

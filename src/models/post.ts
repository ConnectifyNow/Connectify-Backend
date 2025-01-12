import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  title: string;
  imageUrl?: string;
  content: string;
  date: string;
  comments: string[];
  requiredSkills: number[];
  likes: string[];
}

const PostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String },
  content: { type: String, required: true },
  date: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  requiredSkills: [{ type: Number, ref: "Skill", required: true }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model<IPost>("Post", PostSchema);

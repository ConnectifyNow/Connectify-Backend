import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: string;
  title: string;
  imageUrl?: string;
  content: string;
  date: string;
  requiredSkills: string[];
  likes: string[];
}

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String },
  content: { type: String, required: true },
  date: { type: String },
  requiredSkills: [{ type: String, ref: "Skill", required: true }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IPost>("Post", PostSchema);

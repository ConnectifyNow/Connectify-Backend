import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user_id: string;
  title: string;
  image_url?: string;
  content: string;
  date: string;
  comments: string[];
  required_skills: number[];
  likes: string[];
}

const PostSchema: Schema = new Schema({
  user_id: { type: Schema.Types.UUID, ref: "User", required: true },
  title: { type: String, required: true },
  image_url: { type: String },
  content: { type: String, required: true },
  date: { type: String },
  comments: [{ type: Schema.Types.UUID, ref: "Comment" }],
  required_skills: [{ type: Number, ref: "Skill", required: true }],
  likes: [{ type: Schema.Types.UUID, ref: "User" }],
});

export default mongoose.model<IPost>("Post", PostSchema);

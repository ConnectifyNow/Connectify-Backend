import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  id: number;
  name: string;
}

const SkillSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<ISkill>("Skill", SkillSchema);

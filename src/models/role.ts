import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  id: number;
  name: string;
}

const RoleSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<IRole>("Role", RoleSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<IRole>("Role", RoleSchema);

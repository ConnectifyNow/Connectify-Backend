import mongoose, { Schema, Document } from "mongoose";

export interface IFocusArea extends Document {
  id: number;
  name: string;
}

const FocusAreaSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<IFocusArea>("FocusArea", FocusAreaSchema);

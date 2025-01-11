import mongoose, { Schema, Document } from "mongoose";

export interface IFocusArea extends Document {
  name: string;
}

const FocusAreaSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<IFocusArea>("FocusArea", FocusAreaSchema);

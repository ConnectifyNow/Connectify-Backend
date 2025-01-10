import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteer extends Document {
  phone: string;
  first_name: string;
  last_name: string;
  city: number;
  age: number;
  skills: number[];
  image_url?: string;
  about?: string;
  user_id: string;
}

const VolunteerSchema: Schema = new Schema({
  phone: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  city: { type: Number, ref: "City", required: true },
  age: { type: Number },
  skills: [{ type: Number, ref: "Skill", required: true }],
  image_url: { type: String },
  about: { type: String },
  user_id: { type: Schema.Types.UUID, ref: "User", required: true },
});

export default mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

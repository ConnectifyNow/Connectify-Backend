import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteer extends Document {
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  userId: string;
  skills: string[];
  imageUrl?: string;
  about?: string;
}

const VolunteerSchema: Schema = new Schema({
  phone: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, ref: "City" },
  age: { type: Number },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  imageUrl: { type: String },
  about: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);

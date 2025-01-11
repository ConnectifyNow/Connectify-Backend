import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  city: number;
  name: string;
  description?: string;
  image_url?: string;
  userId: string;
  focusAreas: number[];
  websiteLink?: string;
}

const OrganizationSchema: Schema = new Schema({
  city: { type: Number, ref: "City", required: true },
  name: { type: String, required: true },
  description: { type: String },
  image_url: { type: String },
  userId: { type: Schema.Types.UUID, ref: "User", required: true },
  focusAreas: [{ type: Number, ref: "FocusArea" }],
  websiteLink: { type: String },
});

export default mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);

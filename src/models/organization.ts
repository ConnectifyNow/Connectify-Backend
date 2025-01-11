import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  city: number;
  name: string;
  userId: string;
  focusAreas: number[];
  description?: string;
  imageUrl?: string;
  websiteLink?: string;
}

const OrganizationSchema: Schema = new Schema({
  city: { type: Number, ref: "City", required: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  userId: { type: Schema.Types.UUID, ref: "User", required: true },
  focusAreas: [{ type: Number, ref: "FocusArea" }],
  websiteLink: { type: String },
});

export default mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);

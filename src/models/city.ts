import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true },
});

const CityModel = mongoose.model<ICity>("City", CitySchema);
export default CityModel;

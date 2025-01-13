import mongoose, { Document } from "mongoose";
import { Role } from "../types";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  refreshTokens: string[];
  role: Role;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  refreshTokens: {
    type: [String],
    required: false
  },
  role: {
    type: Number,
    required: true
  }
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;

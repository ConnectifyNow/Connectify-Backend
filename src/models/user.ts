import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, ref: "Role", required: true },
});

export default mongoose.model<IUser>("User", UserSchema);

// import mongoose, { Document } from "mongoose";

// export interface IUser extends Document {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   password?: string;
//   refreshTokens: string[];
//   type: "association" | "student" | "unknown";
//   //   image?: {
//   //     originalName?: string;
//   //     serverFilename?: string;
//   //   };
//   bio: string;
// }

// const userSchema = new mongoose.Schema<IUser>({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: false,
//   },
//   refreshTokens: {
//     type: [String],
//     required: false,
//   },
//   //   image: {
//   //     originalName: { type: String, required: false },
//   //     serverFilename: { type: String, required: false },
//   //   },
//   bio: {
//     type: String,
//     required: true,
//   },
// });

// const UserModel = mongoose.model<IUser>("User", userSchema);

// export default UserModel;

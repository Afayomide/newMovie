import mongoose, { Types } from "mongoose";

export interface User {
  email: string;
  username: string;
  password: string;
  verified: boolean;
  token?: string;
  tokenExpires?: Date;
  status?: string;
  movies: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  token: {
    type: String,
    required: false,
  },
  tokenExpires: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
});

export default mongoose.model<User>("Users", userSchema);

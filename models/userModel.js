import mongoose from "mongoose";

// create user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    orders: {
      type: Number,
      required: true,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
  },
  { timestamps: true }
);

//create and export user model
export const UserModel = mongoose.model("User", userSchema);

import mongoose from "mongoose";
import { mongodbUri } from "../config/config.js";

export async function connectDB() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("error connecting to database");
    console.log(error);
  }
}

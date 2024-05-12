import mongoose from "mongoose";

// create rider schema
const riderSchema = new mongoose.Schema(
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
    deliveries: {
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
    },
    password: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedOn: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "DISABLED"],
      required: true,
      default: "PENDING",
    },
    availability: {
      type: String,
      enum: ["AVAILABLE", "UNAVAILABLE", "BUSY"],
      required: true,
      default: "UNAVAILABLE",
    },
  },
  { timestamps: true }
);

//create and export rider model
export const RiderModel = mongoose.model("Rider", riderSchema);

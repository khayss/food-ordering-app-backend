import mongoose from "mongoose";

// create food schema
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    priceInCents: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: {
      type: [{ type: String, required: true }],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

//create and export food model
export const FoodModel = mongoose.model("Food", foodSchema);

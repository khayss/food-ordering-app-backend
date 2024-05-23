import mongoose from "mongoose";

// create order schema
const orderSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Food",
    },
    quantity: { type: Number, required: true },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pricePaidInCents: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//create and export order model
export const OrderModel = mongoose.model("Order", orderSchema);

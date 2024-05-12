import mongoose from "mongoose";

// create delivery schema
const deliverySchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
    },
    status: {
      type: String,
      enum: ["PENDING", "DISPATCHED", "DELIVERED", "FAILED"],
    },
  },
  { timestamps: true }
);

//create and export delivery model
export const DeliveryModel = mongoose.model("Delivery", deliverySchema);

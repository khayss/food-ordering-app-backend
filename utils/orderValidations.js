import { z } from "zod";
import { AppError } from "./error.js";

const orderSchema = z.object({
  deliveryAddress: z
    .string({ required_error: "'deliveryAddress' field is required" })
    .trim()
    .min(3, "'deliveryAddress' field value is too short")
    .max(255, "'deliveryAddress' field is too long. max characters is 255"),
  foodId: z
    .string({ required_error: "'foodId' field is required" })
    .trim()
    .length(24, "'foodId' must be 24 character string"),
  quantity: z
    .number({ coerce: true, message: "'quantity' field is required" })
    .gt(0, "quantity cannot be less than 1")
    .int("quantity must be an integer"),
});

export function validateOrderReqBody(data) {
  const result = orderSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AppError(
      "1001",
      400,
      "ValidationError",
      "Incomplete or invalid order body",
      details
    );
  }
}

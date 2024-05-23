import { z } from "zod";
import { AppError } from "./error.js";

/* SCHEMAS */

// create food req body schema
export const createFoodSchema = z.object({
  name: z
    .string({
      required_error: "'name' field is required",
      invalid_type_error: "'name' field accepts only type string",
    })
    .trim()
    .min(3, "'name' field value is too short. Must be 3 characters or more")
    .max(255, "'name' field cannot exceed 255 characters"),
  category: z
    .string({
      required_error: "'category' field is required",
      invalid_type_error: "'category' field accepts only type string",
    })
    .trim()
    .toLowerCase()
    .min(3, "'category' field value is too short. Must be 3 characters or more")
    .max(255, "'category' field cannot exceed 255 characters"),
  stock: z
    .number({
      coerce: true,
      required_error: "'stock' field is required",
      invalid_type_error: "'stock' field accepts only type number",
    })
    .positive("'stock' field accepts only positive number"),
  priceInCents: z
    .number({
      coerce: true,
      required_error: "'priceInCents' field is required",
      invalid_type_error: "'priceInCents' field accepts only type number",
    })
    .min(1, "'priceInCents' field value cannot be less than 1")
    .positive("'priceInCents' field accepts only positive number"),
  discountPercentage: z
    .number({
      coerce: true,
      required_error: "'discountPercentage' field is required",
      invalid_type_error: "'discountPercentage' field accepts only type number",
    })
    .gte(0, "'discountPercentage' field cannot be less than zero (0)"),
});

/* VALIDATORS */

// new food req body validator
export function validateNewFoodReqBody(data) {
  const result = createFoodSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    const details = result.error.issues.map((issue) => issue.message);
    throw new AppError(
      "1001",
      400,
      "ValidationError",
      "Incomplete or invalid login body",
      details
    );
  }
}

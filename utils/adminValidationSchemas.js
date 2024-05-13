import { z } from "zod";

// Zod schema to validate admin signup req body
export const adminSignupSchema = z.object({
  email: z
    .string({ required_error: "Required field: email field cannot be null" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email: email field must contain a valid email" })
    .max(255),
  password: z
    .string({
      required_error: "Required field: password field is cannot be null",
    })
    .trim()
    .min(8, "Password too short: password must be have minimum of 8 characters")
    .max(
      255,
      "Max length exceeded: max length for password field is 255 characters"
    ),
  firstname: z
    .string({
      required_error: "Required field: firstname field cannot be null",
      invalid_type_error: "Invalid type: firstname must be a string",
    })
    .trim()
    .min(1, "Firstname too short: firstname must have minimum of 1 character")
    .max(
      255,
      "Max length exceeded: max length for firstname field is 255 characters"
    ),
  lastname: z
    .string({
      required_error: "Required field: lastname field cannot be null",
      invalid_type_error: "Invalid type: lastname must be a string",
    })
    .min(1, "Lastname too short: lastname must have minimum of 1 character")
    .max(
      255,
      "Max length exceeded: max length for lastname field is 255 characters"
    ),
  tel: z
    .number({
      required_error: "Required field: tel field cannot be null",
      invalid_type_error: "Invalid type: phone number must be a number",
      coerce: true,
    })
    .min(
      7000000000,
      "Invalid phone number: phone number must be a valid phone number with 10 digits excluding the first zero(0)"
    )
    .max(
      9999999999,
      "Invalid phone number: phone number must be a valid phone number with 10 digits excluding the first zero(0)"
    ),
});
